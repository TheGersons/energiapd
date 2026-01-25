export interface IPermissionCatalog {
  id: string;
  moduleName: string;
  page: IPage[];
}

interface IPage {
  id: string;
  name: string;
  permission: IPermission[];
}

interface IPermission {
  id: string;
  label: string;
  slug: string;
}

export interface IRolePayload {
  id?: string;
  slug: string;
  label: string;
  module: string;
  page: string;
}
