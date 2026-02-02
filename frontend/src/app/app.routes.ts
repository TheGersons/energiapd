import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('@ui/template/main/main').then((m) => m.Main),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'configuraciones/permisos',
      },
      {
        path: 'configuraciones/permisos',
        loadComponent: () =>
          import('@ui/pages/settings/permission/permission').then(
            (m) => m.Permission,
          ),
        children: [
          {
            path: '',
            pathMatch: 'full',
            loadComponent: () =>
              import('@ui/pages/settings/permission/dashboard/dashboard').then(
                (m) => m.Dashboard,
              ),
          },
          {
            path: 'crear',
            loadComponent: () =>
              import('@ui/pages/settings/permission/create/create').then(
                (m) => m.Create,
              ),
          },
          {
            path: 'editar/:id',
            loadComponent: () =>
              import('@ui/pages/settings/permission/create/create').then(
                (m) => m.Create,
              ),
          },
        ],
      },
      {
        path: 'computer-inventory/dashboard',
        loadComponent: () =>
          import('@ui/pages/computer-inventory/computer-inventory').then(
            (m) => m.ComputerInventory,
          ),
      },
      {
        path: 'configuraciones/usuarios',
        loadComponent: () =>
          import('@ui/pages/settings/user/user').then((m) => m.User),
        children: [
          {
            path: '',
            pathMatch: 'full',
            loadComponent: () =>
              import('@ui/pages/settings/user/dashboard/dashboard').then(
                (m) => m.Dashboard,
              ),
          },
          {
            path: 'crear',
            loadComponent: () =>
              import('@ui/pages/settings/user/create/create').then(
                (m) => m.Create,
              ),
          },
          {
            path: 'editar/:id',
            loadComponent: () =>
              import('@ui/pages/settings/user/create/create').then(
                (m) => m.Create,
              ),
          },
        ],
      },
      {
        path: 'tool-loans/home',
        loadComponent: () =>
          import('@ui/pages/tool-loans/home/tool-home').then((m) => m.ToolHome),
      },
      {
        path: 'prestamo-herramientas/inventario',
        loadComponent: () =>
          import('@ui/pages/tool-loans/inventory/inventory').then(
            (m) => m.Inventory,
          ),
        children: [
          {
            path: '',
            pathMatch: 'full',
            loadComponent: () =>
              import('@ui/pages/tool-loans/inventory/dashboard/dashboard').then(
                (m) => m.Dashboard,
              ),
          },
          {
            path: 'crear',
            loadComponent: () =>
              import('@ui/pages/tool-loans/inventory/create/create').then(
                (m) => m.Create,
              ),
          },
          {
            path: 'editar/:id',
            loadComponent: () =>
              import('@ui/pages/tool-loans/inventory/create/create').then(
                (m) => m.Create,
              ),
          },
        ],
      },
      {
        path: 'prestamo-herramientas/prestamos',
        loadComponent: () =>
          import('@ui/pages/tool-loans/loans/loans').then((m) => m.Loans),
        children: [
          {
            path: '',
            pathMatch: 'full',
            loadComponent: () =>
              import('@ui/pages/tool-loans/loans/dashboard/dashboard').then(
                (m) => m.Dashboard,
              ),
          },
          {
            path: 'crear',
            loadComponent: () =>
              import('@ui/pages/tool-loans/loans/create/create').then(
                (m) => m.Create,
              ),
          },
          {
            path: 'editar/:id',
            loadComponent: () =>
              import('@ui/pages/tool-loans/loans/create/create').then(
                (m) => m.Create,
              ),
          },
        ],
      },
    ],
  },
];
