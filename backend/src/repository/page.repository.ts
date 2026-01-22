import { PageModel } from "@model/page.model";
import { IPage } from "@type/page.type";

class PageRepository {
  async findAll(): Promise<IPage[]> {
    return await PageModel.findAll();
  }

  async findOne(id: string): Promise<IPage | null> {
    return await PageModel.findOne({ where: { id } });
  }

  /**
   * 
   * @param page: {
   * id
   * idModule
   * name
   * label
   * url
   * description
   * }
   * @returns Promise<>IPage> Created Page
   */
  async create(page: IPage): Promise<IPage> {
    return await PageModel.create(page);
  }

  async delete(id: string): Promise<number> {
    return await PageModel.destroy({ where: { id } });
  }

  async update(page: IPage): Promise<number> {
    return (await PageModel.update(page, { where: { id: page.id } })).flat()[0];
  }
}

export const pageRepository = new PageRepository();
