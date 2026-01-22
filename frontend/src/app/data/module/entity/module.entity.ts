export interface ModuleEntity {
  id?: string;
  name: string;
  label: string;
  page: PageEntity[];
}

interface PageEntity {
  id: string;
  idModule: string;
  name: string;
  label: string;
  url: string;
  description: string;
}
