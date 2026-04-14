import { ILoan, ILoanDTO, ILoanResponse } from "@type/loan.type";
import prisma from "@database/index";
import {
  loanCreatedTemplate,
  loanConfirmedTemplate,
  loanWithQRTemplate,
  loanReturnTemplate,
  loanExtensionTemplate,
} from "@mail/loan.mail";
import { mailService } from "@mail/mail.service";
import QRCode from "qrcode";

class LoanRepository {
  /**
   * Obtiene todos los préstamos incluyendo el departamento asociado.
   */
  async findAll(): Promise<ILoan[]> {
    return await prisma.loan.findMany({
      include: {
        department: true,
      },
    });
  }

  /**
   * Busca un préstamo detallado.
   * Transforma la estructura de loanDetails para retornar una lista plana de herramientas.
   */
  async findOne(where: Partial<ILoan>): Promise<ILoanResponse | null> {
    if (!where.id) return null;

    const response = await prisma.loan.findUnique({
      where: { id: where.id },
      include: {
        loanApproves: {
          select: {
            id: true,
            idLoan: true,
            approved: true,
            type: true,
            createdAt: true,
            newReturnDate: true,
            user: {
              select: {
                fullname: true,
                id: true,
              },
            },
          },
        },
        department: true,
        loanDetails: {
          include: {
            tool: true,
          },
        },
      },
    });

    if (!response) return null;

    const { loanDetails, ...loanData } = response;

    return {
      ...loanData,
      tool: loanDetails.map((detail) => detail.tool),
    };
  }

  /**
   * Actualiza los datos generales de un préstamo.
   */
  async update(loan: ILoan): Promise<number> {
    const { id, ...data } = loan;
    const rs = await prisma.loan.updateMany({
      data,
      where: { id },
    });
    return rs.count;
  }

  /**
   * Crea un préstamo y sus detalles (herramientas asociadas) en una sola operación.
   */
  async create(loan: ILoanDTO): Promise<string> {
    const { tools, ...loanDTO } = loan;
    let createdLoan;
    try {
      createdLoan = await prisma.loan.create({
        data: {
          ...loanDTO,
          loanDetails: {
            createMany: { data: tools },
          },
        },
        include: {
          loanDetails: {
            include: {
              tool: true,
            },
          },
        },
      });
      return createdLoan.id;
    } catch (error) {
      throw error;
    } finally {
      if (createdLoan) {
        const authorizers = await prisma.user.findMany({
          where: {
            userRoles: {
              some: {
                role: {
                  rolePermission: {
                    some: {
                      permission: {
                        slug: "prestamo-herramientas:autorizar",
                      },
                    },
                  },
                },
              },
            },
            status: true,
            idDepartment: loanDTO.idDepartment,
          },
          select: {
            email: true,
          },
        });

        mailService.send({
          to: authorizers.map((a) => a.email),
          subject: `Solicitud de préstamo de herramientas #${createdLoan.id.slice(0, 8)}`,
          attachments: undefined,
          html: loanCreatedTemplate({
            loanId: createdLoan.id,
            actionUrl: `${process.env.FRONTEND_URL}/herramienta/prestamos/ver/${createdLoan.id}`,
            authorizerName: "Estimados Autorizadores",
            requestDate: createdLoan.createdAt.toLocaleDateString(),
            requesterName: createdLoan.name,
            returnDate: createdLoan.returnDate.toLocaleDateString(),
            tools: createdLoan.loanDetails.map((detail) => ({
              brand: detail.tool.brand,
              name: detail.tool.name,
              serial: detail.tool.serial,
            })),
          }),
        });
      }
    }
  }

  /**
   * Registra la aprobación de un préstamo.
   */
  async approval(
    idLoan: string,
    idUser: string,
    approved: boolean,
    status: string,
    signature: string,
    notes: string,
  ): Promise<string> {
    try {
      const rs = await prisma.loan.update({
        where: { id: idLoan },
        data: {
          status,
          loanApproves: {
            create: {
              idUser,
              approved,
              notes,
              type: "approval",
              signature,
            },
          },
        },
      });
      return rs.id;
    } catch (error) {
      throw error;
    } finally {
      const loan = await prisma.loan.findUnique({
        where: { id: idLoan },
        select: {
          id: true,
          name: true,
          createdAt: true,
          returnDate: true,
          status: true,
          loanDetails: {
            select: {
              tool: {
                select: {
                  name: true,
                  brand: true,
                  serial: true,
                },
              },
            },
          },
        },
      });

      const warehousemen = await prisma.user.findMany({
        where: {
          userRoles: {
            some: {
              role: {
                rolePermission: {
                  some: {
                    permission: {
                      slug: "prestamo-herramientas:entregar",
                    },
                  },
                },
              },
            },
          },
          status: true,
        },
        select: {
          email: true,
        },
      });

      mailService.send({
        to: warehousemen.map((a) => a.email),
        subject: `Autorización de Préstamo ${idLoan.slice(0, 8)}`,
        attachments: undefined,
        html: loanConfirmedTemplate({
          title: "Gestión de Préstamo de Herramientas",
          subtitle: "Notificación de autorización de préstamo de herramientas",
          requesterName: "Almacenista",
          statusText: loan?.status ? "AUTORIZADA" : "DENEGADA",
          statusColor: "#0f172a",
          loanId: idLoan,
          tools: loan?.loanDetails.map((a) => a.tool) ?? [],
          requestDate: loan?.createdAt.toLocaleDateString() ?? "",
          returnDate: loan?.returnDate.toLocaleDateString() ?? "",
          actionUrl: `${process.env.FRONTEND_URL}/herramientas/prestamos/ver/${idLoan}`,
        }),
      });
    }
  }

  /**
   * Procesa la entrega física. Usa una transacción para actualizar el estado de las herramientas.
   */
  async delivery(
    idLoan: string,
    idUser: string,
    approved: boolean,
    status: string,
    notes: string,
    signature: string,
  ): Promise<string> {
    let modified: boolean = false;
    try {
      return await prisma.$transaction(async (tx) => {
        const details = await tx.loanDetail.findMany({
          where: { idLoan },
          select: { idTool: true },
        });
        const toolIds = details.map((d) => d.idTool);

        const loanUpdate = await tx.loan.update({
          where: { id: idLoan },
          data: {
            status,
            loanApproves: {
              create: {
                idUser,
                approved,
                notes,
                type: "delivery",
                signature,
              },
            },
          },
        });

        await tx.tool.updateMany({
          where: { id: { in: toolIds } },
          data: { available: !approved },
        });

        modified = true;
        return loanUpdate.id;
      });
    } catch (error) {
      throw error;
    } finally {
      if (modified) {
        const loan = await prisma.loan.findUnique({
          select: {
            id: true,
            name: true,
            idDepartment: true,
            returnDate: true,
            createdAt: true,
            loanDetails: {
              select: {
                tool: {
                  select: {
                    name: true,
                    brand: true,
                    serial: true,
                  },
                },
              },
            },
          },
          where: {
            id: idLoan,
          },
        });

        const authorizers = await prisma.user.findMany({
          where: {
            userRoles: {
              some: {
                role: {
                  rolePermission: {
                    some: {
                      permission: {
                        slug: "prestamo-herramientas:autorizar",
                      },
                    },
                  },
                },
              },
            },
            status: true,
            idDepartment: loan?.idDepartment,
          },
          select: {
            email: true,
          },
        });

        const qrBase64 = await this.generateQR(
          `${process.env.FRONTEND_URL}/pase-salida/${idLoan}`,
        );

        const base64Data = qrBase64.split(",")[1];

        await mailService.send({
          to: authorizers.map((a) => a.email),
          subject: `Solicitud de préstamo ${idLoan.slice(0, 8)} entregado`,
          attachments: [
            {
              filename: "qr-code.png",
              content: base64Data,
              encoding: "base64",
              cid: "loan_qr_code",
            },
          ],
          html: loanWithQRTemplate({
            authorizerName: "Autorizador",
            requesterName: loan?.name ?? "",
            loanId: loan?.id ?? "",
            requestDate: loan?.createdAt.toLocaleDateString() ?? "",
            returnDate: loan?.returnDate.toLocaleDateString() ?? "",
            tools: loan?.loanDetails.map((a) => a.tool) ?? [],
          }),
        });
      }
    }
  }

  /**
   * Procesa la devolución. Las herramientas vuelven a estar disponibles.
   */
  async return(
    idLoan: string,
    idUser: string,
    approved: boolean,
    status: string,
    notes: string,
    signature: string,
  ): Promise<string> {
    let modified: boolean = false;
    try {
      return await prisma.$transaction(async (tx) => {
        const details = await tx.loanDetail.findMany({
          where: { idLoan },
          select: { idTool: true },
        });
        const toolIds = details.map((d) => d.idTool);

        const loanUpdate = await tx.loan.update({
          where: { id: idLoan },
          data: {
            status,
            loanApproves: {
              create: {
                idUser,
                approved,
                notes,
                type: "return",
                signature,
              },
            },
          },
        });

        await tx.tool.updateMany({
          where: { id: { in: toolIds } },
          data: { available: approved },
        });
        modified = true;
        return loanUpdate.id;
      });
    } catch (error) {
      throw error;
    } finally {
      if (modified) {
        const loan = await prisma.loan.findUnique({
          select: {
            id: true,
            name: true,
            idDepartment: true,
            returnDate: true,
            createdAt: true,
            loanDetails: {
              select: {
                tool: {
                  select: {
                    name: true,
                    brand: true,
                    serial: true,
                  },
                },
              },
            },
          },
          where: {
            id: idLoan,
          },
        });

        const authorizers = await prisma.user.findMany({
          where: {
            userRoles: {
              some: {
                role: {
                  rolePermission: {
                    some: {
                      permission: {
                        slug: "prestamo-herramientas:autorizar",
                      },
                    },
                  },
                },
              },
            },
            status: true,
            idDepartment: loan?.idDepartment,
          },
          select: {
            email: true,
          },
        });

        const receivedBy = await prisma.user.findUnique({
          where: {
            id: idUser,
          },
          select: {
            fullname: true,
          },
        });

        await mailService.send({
          to: authorizers.map((_) => _.email),
          subject: `Solicitud de Préstamo ${idLoan.slice(0, 8)} finalizado`,
          attachments: undefined,
          html: loanReturnTemplate({
            authorizerName: "Autorizadores",
            requesterName: loan?.name ?? "",
            loanId: loan?.id ?? "",
            receivedBy: receivedBy?.fullname ?? "",
            returnDate: new Date().toLocaleDateString(),
            actionUrl: `${process.env.FRONTEND_URL}/herramientas/prestamos/ver/${idLoan}`,
            tools: loan?.loanDetails.map((_) => _.tool) ?? [],
          }),
        });
      }
    }
  }

  /**
   * Extiende la fecha de retorno de un préstamo.
   */
  async extend(
    idLoan: string,
    idUser: string,
    newReturnDate: Date,
    notes: string,
    signature: string,
  ): Promise<string> {
    let rs;
    let oldDate;
    try {
      oldDate = await prisma.loan.findUnique({
        where: { id: idLoan },
        select: { returnDate: true, loanDetails: { select: { tool: true } } },
      });
      rs = await prisma.loan.update({
        where: { id: idLoan },
        data: {
          returnDate: newReturnDate,
          loanApproves: {
            create: {
              idUser,
              approved: true,
              notes,
              type: "extension",
              signature,
              newReturnDate,
            },
          },
        },
      });
      return rs.id;
    } catch (error) {
      throw error;
    } finally {
      if (rs) {
        const authorizer = await prisma.user.findUnique({
          where: { id: idUser },
          select: { fullname: true },
        });

        const warehousemen = await prisma.user.findMany({
          where: {
            userRoles: {
              some: {
                role: {
                  rolePermission: {
                    some: {
                      permission: {
                        slug: "prestamo-herramientas:entregar",
                      },
                    },
                  },
                },
              },
            },
            status: true,
          },
          select: {
            email: true,
          },
        });

        mailService.send({
          to: warehousemen.map((_) => _.email),
          attachments: undefined,
          subject: `Extensión de préstamo #${rs.id.slice(0, 8)}`,
          html: loanExtensionTemplate({
            authorizerName: authorizer?.fullname ?? "",
            loanId: idLoan,
            oldReturnDate: oldDate?.returnDate.toLocaleDateString() ?? "",
            newReturnDate: new Date(newReturnDate).toLocaleDateString(),
            requesterName: rs.name,
            tools: oldDate?.loanDetails.map((_) => _.tool) ?? [],
            reason: notes,
            actionUrl: `${process.env.FRONTEND_URL}/herramientas/prestamos/ver/${idLoan}`,
          }),
        });
      }
    }
  }

  async findOverdueLoans() {
    return await prisma.loan.findMany({
      where: {
        returnDate: { lt: new Date() },
        status: "Entregado",
      },
      include: {
        loanDetails: { include: { tool: true } },
      },
    });
  }

  async findReceiverForExpiry(departmentIds: string[]) {
    return await prisma.user.findMany({
      where: {
        status: true,
        idDepartment: {
          in: departmentIds,
        },
        userRoles: {
          some: {
            role: {
              rolePermission: {
                some: {
                  permission: {
                    slug: {
                      in: [
                        "prestamo-herramientas:autorizar",
                        "prestamo-herramientas:entregar",
                      ],
                    },
                  },
                },
              },
            },
          },
        },
      },
      select: {
        email: true,
      },
    });
  }

  generateQR = async (text: string): Promise<string> => {
    try {
      return await QRCode.toDataURL(text, {
        margin: 1,
        width: 200,
        color: {
          dark: "#0f172a",
          light: "#ffffff",
        },
      });
    } catch (err) {
      console.error("Error generando QR:", err);
      return "";
    }
  };
}

export const loanRepository = new LoanRepository();
