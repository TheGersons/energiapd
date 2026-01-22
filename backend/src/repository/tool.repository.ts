import { sequelize } from "@database/index";
import { ITool } from "@type/tool.type";
import { ToolModel } from "@model/tool.model";
import { WhereOptions } from "@sequelize/core";

class ToolRepository {
  async findAll(): Promise<ITool[]> {
    return await ToolModel.findAll({ order: [["createdAt", "ASC"]] });
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
}

export const toolRepository = new ToolRepository();
