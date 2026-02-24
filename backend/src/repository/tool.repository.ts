import { ITool } from "@type/tool.type";
import { ToolModel } from "@model/tool.model";
import prisma from "@database/index";

class ToolRepository {
  async findAll(): Promise<ITool[]> {
    return await prisma.tool.findMany({
      where: { status: true },
      orderBy: {
        createdAt: "asc",
      },
    });
  }

  async findOne(tool: Partial<ITool>): Promise<ITool | null> {
    return await prisma.tool.findUnique({ where: { id: tool.id } });
  }

  async update(tool: ITool): Promise<number> {
    return (
      await prisma.tool.updateMany({ data: tool, where: { id: tool.id } })
    ).count;
  }

  async create(tool: ITool): Promise<ITool> {
    return await prisma.tool.create({ data: tool });
  }

  async delete(id: string): Promise<number> {
    return (
      await prisma.tool.updateMany({ data: { status: false }, where: { id } })
    ).count;
  }
}

export const toolRepository = new ToolRepository();
