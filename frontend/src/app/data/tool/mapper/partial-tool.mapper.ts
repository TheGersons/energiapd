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
      ...(param.status !== undefined && { toolStatus: param.status }),
      ...(param.img !== undefined && { toolImg: param.img }),
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
      ...(param.toolStatus !== undefined && { status: param.toolStatus }),
      ...(param.toolImg !== undefined && { img: param.toolImg }),
    };
  }
}
