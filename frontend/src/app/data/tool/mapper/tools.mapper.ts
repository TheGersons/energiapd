import { Mapper } from '@base/mapper';
import { ToolEntity } from '../tool.entity';
import { ToolModel } from '@domain/tool/tool.model';

export class ToolsMapper extends Mapper<ToolEntity[], ToolModel[]> {
  override mapFrom(param: ToolEntity[]): ToolModel[] {
    return param.map((a) => ({
      toolId: a.id,
      toolName: a.name,
      toolDescription: a.description,
      toolBrand: a.brand,
      toolModel: a.model,
      toolSerial: a.serial,
      toolImg: a.image,
      toolAvailable: a.available,
      toolCode: a.code,
      createdAt: a.createdAt,
      updatedAt: a.updatedAt,
    }));
  }

  override mapTo(param: ToolModel[]): ToolEntity[] {
    return param.map((a) => ({
      id: a.toolId,
      name: a.toolName,
      description: a.toolDescription,
      brand: a.toolBrand,
      model: a.toolModel,
      serial: a.toolSerial,
      image: a.toolImg,
      available: a.toolAvailable,
      code: a.toolCode,
      createdAt: a.createdAt,
      updatedAt: a.updatedAt,
    }));
  }
}
