import { Routes } from '@angular/router';
import { RenderMode } from '@angular/ssr';
import { authGuard } from '@base/guard/auth-guard';

export const routes: Routes = [
  // --- RUTAS PÚBLICAS ---
  {
    path: 'iniciar-sesion',
    loadComponent: () => import('@ui/template/auth/auth').then((m) => m.Auth),
  },

  // --- RUTAS PROTEGIDAS (Main Layout) ---
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('@ui/template/main/main').then((m) => m.Main),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'configuraciones/permisos' },

      // Módulo: Configuraciones
      {
        path: 'configuraciones',
        children: [
          {
            path: 'permisos',
            loadComponent: () =>
              import('@ui/pages/settings/permission/permission').then(
                (m) => m.Permission,
              ),
            children: [
              {
                path: '',
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
            path: 'usuarios',
            loadComponent: () =>
              import('@ui/pages/settings/user/user').then((m) => m.User),
            children: [
              {
                path: '',
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
        ],
      },

      // Módulo: Inventario de Computo
      {
        path: 'computer-inventory',
        children: [
          {
            path: 'dashboard',
            loadComponent: () =>
              import('@ui/pages/computer-inventory/computer-inventory').then(
                (m) => m.ComputerInventory,
              ),
          },
        ],
      },

      // Módulo: Herramientas (Inventario y Préstamos)
      {
        path: 'herramientas',
        children: [
          {
            path: 'inventario',
            loadComponent: () =>
              import('@ui/pages/tool-loans/inventory/inventory').then(
                (m) => m.Inventory,
              ),
            children: [
              {
                path: '',
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
            path: 'prestamos',
            loadComponent: () =>
              import('@ui/pages/tool-loans/loans/loans').then((m) => m.Loans),
            children: [
              {
                path: '',
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
    ],
  },

  // --- COMODÍN ---
  { path: '**', redirectTo: 'iniciar-sesion' },
];
