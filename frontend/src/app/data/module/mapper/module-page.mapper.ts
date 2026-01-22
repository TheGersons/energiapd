import { ModuleModel } from '@domain/module/module.model';
import { ModuleEntity } from '../entity/module.entity';
import { Mapper } from '@base/mapper';

export class ModuleMapper extends Mapper<ModuleEntity[], ModuleModel[]> {
  override mapFrom(param: ModuleEntity[]): ModuleModel[] {
    return param.map((m) => ({
      moduleId: m.id,
      moduleName: m.name,
      moduleLabel: m.label,
      page: m.page.map((p) => ({
        pageId: p.id,
        moduleId: p.idModule,
        pageName: p.name,
        pageLabel: p.label,
        pageUrl: p.url,
        pageDescription: p.description,
      })),
    }));
  }

  override mapTo(param: ModuleModel[]): ModuleEntity[] {
    return param.map((m) => ({
      id: m.moduleId,
      name: m.moduleName,
      label: m.moduleLabel,
      page: m.page.map((p) => ({
        id: p.pageId,
        idModule: p.moduleId,
        name: p.pageName,
        label: p.pageLabel,
        url: p.pageUrl,
        description: p.pageDescription,
      })),
    }));
  }
}
