export interface ModuleModel {
  moduleId?: string;
  moduleName: string;
  moduleLabel: string;
  page: PageModel[];
  permissions?: string[];
}

export interface PageModel {
  pageId: string;
  moduleId: string;
  pageName: string;
  pageLabel: string;
  pageUrl: string;
  pageDescription: string;
}
