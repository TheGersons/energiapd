import { ITool } from "@type/tool.type";
import prisma from "@database/index";

class ToolRepository {
  /**
   * Obtiene todas las herramientas activas ordenadas por fecha de creación.
   */
  async findAll(): Promise<ITool[]> {
    return await prisma.tool.findMany({
      where: {
        status: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });
  }

  async findAvailable(): Promise<ITool[]> {
    return await prisma.tool.findMany({
      where: { available: true, status: true },
      orderBy: {
        createdAt: "asc",
      },
    });
  }

  /**
   * Busca una herramienta específica por ID.
   */
  async findOne(where: Partial<ITool>): Promise<ITool | null> {
    if (!where.id) return null;

    return await prisma.tool.findUnique({
      where: { id: where.id },
    });
  }

  /**
   * Actualiza los datos de una herramienta.
   */
  async update(tool: ITool): Promise<number> {
    const { id, ...data } = tool;

    const rs = await prisma.tool.updateMany({
      data,
      where: { id },
    });

    return rs.count;
  }

  /**
   * Registra una nueva herramienta en la base de datos.
   */
  async create(tool: ITool): Promise<ITool> {
    return await prisma.tool.create({
      data: tool,
    });
  }

  /**
   * Realiza un borrado lógico cambiando el estado a inactivo.
   */
  async delete(id: string): Promise<number> {
    const dependencies = await prisma.loan.findMany({
      where: {
        loanDetails: {
          some: {
            idTool: id,
          },
        },
      },
    });
    if (dependencies.length) {
      throw {
        message: "Esta herramienta no puede ser eliminada.",
        name: "Dependencia",
        code: 409,
      };
    }
    const rs = await prisma.tool.updateMany({
      data: { status: false },
      where: { id },
    });

    return rs.count;
  }
}

export const toolRepository = new ToolRepository();
