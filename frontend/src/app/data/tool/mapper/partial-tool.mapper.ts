import { ToolModel } from '@domain/tool/tool.model';
import { ToolEntity } from '../tool.entity';
import { Mapper } from '@base/mapper';

export class PartialToolMapper extends Mapper<
  Partial<ToolEntity>,
  Partial<ToolModel>
> {
  override mapFrom(param: Partial<ToolEntity>): Partial<ToolModel> {
    return {
      ...(param.id !== undefined && { toolId: param.id }),
      ...(param.name !== undefined && { toolName: param.name }),
      ...(param.description !== undefined && {
        toolDescription: param.description,
      }),
      ...(param.brand !== undefined && { toolBrand: param.brand }),
      ...(param.model !== undefined && { toolModel: param.model }),
      ...(param.serial !== undefined && { toolSerial: param.serial }),
      ...(param.image !== undefined && { toolImg: param.image }),
      ...(param.available !== undefined && { toolAvailable: param.available }),
      ...(param.code !== undefined && { toolCode: param.code }),
      ...(param.createdAt !== undefined && { createdAt: param.createdAt }),
      ...(param.updatedAt !== undefined && { updatedAt: param.updatedAt }),
    };
  }

  override mapTo(param: Partial<ToolModel>): Partial<ToolEntity> {
    return {
      ...(param.toolId !== undefined && { id: param.toolId }),
      ...(param.toolName !== undefined && { name: param.toolName }),
      ...(param.toolDescription !== undefined && {
        description: param.toolDescription,
      }),
      ...(param.toolBrand !== undefined && { brand: param.toolBrand }),
      ...(param.toolModel !== undefined && { model: param.toolModel }),
      ...(param.toolSerial !== undefined && { serial: param.toolSerial }),
      ...(param.toolImg !== undefined && { image: param.toolImg }),
      ...(param.toolAvailable !== undefined && {
        available: param.toolAvailable,
      }),
      ...(param.toolCode !== undefined && { code: param.toolCode }),
      ...(param.createdAt !== undefined && { createdAt: param.createdAt }),
      ...(param.updatedAt !== undefined && { updatedAt: param.updatedAt }),
    };
  }
}
