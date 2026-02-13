import { ITool } from "@type/tool.type";
import { ToolModel } from "@model/tool.model";

class ToolRepository {
  async findAll(): Promise<ITool[]> {
    return await ToolModel.findAll({
      where: { status: true },
      order: [["createdAt", "ASC"]],
    });
  }

  async findOne(tool: Partial<ITool>): Promise<ITool | null> {
    return await ToolModel.findOne({ where: tool });
  }

  async update(tool: ITool): Promise<number> {
    return (await ToolModel.update(tool, { where: { id: tool.id } })).flat()[0];
  }

  async create(tool: ITool): Promise<ITool> {
    return await ToolModel.create(tool);
  }

  async delete(id: string): Promise<number> {
    return (
      await ToolModel.update({ status: false }, { where: { id } })
    ).flat()[0];
  }
}

export const toolRepository = new ToolRepository();
