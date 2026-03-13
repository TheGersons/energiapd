import prisma from "@database/index";
import { IDepartment } from "@type/department.type";

class DepartmentRepository {
  async findAll(): Promise<IDepartment[]> {
    return await prisma.department.findMany();
  }

  async create(department: IDepartment): Promise<string> {
    return (
      await prisma.department.create({
        data: department,
      })
    ).id;
  }

  async update(department: IDepartment): Promise<number> {
    return (
      await prisma.department.updateMany({
        data: department,
        where: { id: department.id },
      })
    ).count;
  }

  async findOne(department: Partial<IDepartment>): Promise<IDepartment | null> {
    return await prisma.department.findUnique({
      where: {
        id: department.id,
      },
    });
  }
}

export const departmentRepository = new DepartmentRepository();
