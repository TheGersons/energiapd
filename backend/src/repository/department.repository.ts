import prisma from "@database/index";
import { IDepartment } from "@type/department.type";

class DepartmentRepository {
  /**
   * Obtiene todos los departamentos registrados.
   */
  async findAll(): Promise<IDepartment[]> {
    return await prisma.department.findMany({
      orderBy: {
        name: "asc",
      },
    });
  }

  /**
   * Crea un nuevo departamento y retorna su ID.
   */
  async create(department: IDepartment): Promise<string> {
    const rs = await prisma.department.create({
      data: department,
    });
    return rs.id;
  }

  /**
   * Actualiza un departamento y retorna el conteo de registros afectados.
   */
  async update(department: IDepartment): Promise<number> {
    const { id, ...data } = department;
    const rs = await prisma.department.updateMany({
      data,
      where: { id },
    });
    return rs.count;
  }

  /**
   * Busca un departamento por ID u otros criterios.
   */
  async findOne(where: Partial<IDepartment>): Promise<IDepartment | null> {
    if (Object.keys(where).length === 0) return null;

    return await prisma.department.findFirst({
      where,
    });
  }
}

export const departmentRepository = new DepartmentRepository();
