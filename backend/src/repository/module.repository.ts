import { PageModel } from "@model/page.model";
import { ModuleModel } from "@model/module.model";
import { IModule } from "@type/module.type";

class ModuleRepository {
  async findAllWithPages() {
    return await ModuleModel.findAll({
      include: [
        {
          model: PageModel,
          as: "page",
        },
      ],
      order: [["name", "ASC"]],
    });
  }

  async create(module: IModule): Promise<IModule> {
    return await ModuleModel.create(module);
  }

  async update(module: IModule): Promise<number> {
    return (
      await ModuleModel.update(module, { where: { id: module.id } })
    ).flat()[0];
  }

  async delete(id: string) {
    return await ModuleModel.destroy({ where: { id } });
  }
}

export const moduleRepository = new ModuleRepository();
