// Estos se utilizan para renderizar en la vista
export interface PermissionEntity {
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
