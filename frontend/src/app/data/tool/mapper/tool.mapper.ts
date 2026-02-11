import { Mapper } from '@base/mapper';
import { ToolEntity } from '../tool.entity';
import { ToolModel } from '@domain/tool/tool.model';

export class ToolMapper extends Mapper<ToolEntity, ToolModel> {
  override mapFrom(param: ToolEntity): ToolModel {
    return {
      toolId: param.id,
      toolName: param.name,
      toolDescription: param.description,
      toolBrand: param.brand,
      toolModel: param.model,
      toolSerial: param.serial,
      toolImg: param.image,
      toolAvailable: param.available,
      toolCode: param.code,
      createdAt: param.createdAt,
      updatedAt: param.updatedAt,
    };
  }

  override mapTo(param: ToolModel): ToolEntity {
    return {
      id: param.toolId,
      name: param.toolName,
      description: param.toolDescription,
      brand: param.toolBrand,
      model: param.toolModel,
      serial: param.toolSerial,
      image: param.toolImg,
      available: param.toolAvailable,
      code: param.toolCode,
      createdAt: param.createdAt,
      updatedAt: param.updatedAt,
    };
  }
}
