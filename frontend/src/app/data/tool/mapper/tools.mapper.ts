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
      toolStatus: a.status,
      toolImg: a.img,
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
      status: a.toolStatus,
      img: a.toolImg,
    }));
  }
}
