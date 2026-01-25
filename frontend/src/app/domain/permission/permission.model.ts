// Estos se utilizan para renderizar en la vista
export interface PermissionModel {
  permissionId: string;
  nameModule: string;
  pages: IPage[];
}

interface IPage {
  pageId: string;
  pageName: string;
  permissions: IPermission[];
}

export interface IPermission {
  permissionId: string;
  permissionLabel: string;
  value: string;
}
//
