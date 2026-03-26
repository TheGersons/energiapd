import { Routes } from '@angular/router';
import { authGuard } from '@base/guard/auth.guard';
import { permissionGuard } from '@base/guard/permssions.guard';

export const routes: Routes = [
  // --- RUTAS PÚBLICAS ---
  {
    path: 'iniciar-sesion',
    loadComponent: () => import('@ui/template/auth/auth').then((m) => m.Auth),
  },

  // --- RUTAS PROTEGIDAS (Main Layout) ---
  {
    path: '',
    canActivate: [authGuard], // ← authGuard aquí garantiza que los permisos
    loadComponent: () =>
      //   estén cargados ANTES de cualquier permissionGuard hijo
      import('@ui/template/main/main').then((m) => m.Main),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },

      {
        path: 'dashboard',
        loadComponent: () =>
          import('@ui/pages/dashboard/dashboard').then((m) => m.Dashboard),
      },

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
                canActivate: [permissionGuard(['permisos:leer'])],
                loadComponent: () =>
                  import('@ui/pages/settings/permission/dashboard/dashboard').then(
                    (m) => m.Dashboard,
                  ),
              },
              {
                path: 'crear',
                canActivate: [permissionGuard(['permisos:crear'])],
                loadComponent: () =>
                  import('@ui/pages/settings/permission/create/create').then(
                    (m) => m.Create,
                  ),
              },
              {
                path: 'editar/:id',
                canActivate: [permissionGuard(['permisos:editar'])],
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
                canActivate: [permissionGuard(['usuarios:leer'])],
                loadComponent: () =>
                  import('@ui/pages/settings/user/dashboard/dashboard').then(
                    (m) => m.Dashboard,
                  ),
              },
              {
                path: 'crear',
                canActivate: [permissionGuard(['usuarios:crear'])],
                loadComponent: () =>
                  import('@ui/pages/settings/user/create/create').then(
                    (m) => m.Create,
                  ),
              },
              {
                path: 'editar/:id',
                canActivate: [permissionGuard(['usuarios:editar'])],
                loadComponent: () =>
                  import('@ui/pages/settings/user/create/create').then(
                    (m) => m.Create,
                  ),
              },
            ],
          },

          {
            path: 'departamentos',
            loadComponent: () =>
              import('@ui/pages/settings/department/department').then(
                (m) => m.Department,
              ),
            children: [
              {
                path: '',
                loadComponent: () =>
                  import('@ui/pages/settings/department/dashboard/dashboard').then(
                    (m) => m.Dashboard,
                  ),
              },
              {
                path: 'crear',
                loadComponent: () =>
                  import('@ui/pages/settings/department/create/create').then(
                    (m) => m.Create,
                  ),
              },
              {
                path: 'editar/:id',
                loadComponent: () =>
                  import('@ui/pages/settings/department/create/create').then(
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
                canActivate: [permissionGuard(['inventario-herramienta:leer'])],
                loadComponent: () =>
                  import('@ui/pages/tool-loans/inventory/dashboard/dashboard').then(
                    (m) => m.Dashboard,
                  ),
              },
              {
                path: 'crear',
                canActivate: [
                  permissionGuard(['inventario-herramienta:crear']),
                ],
                loadComponent: () =>
                  import('@ui/pages/tool-loans/inventory/create/create').then(
                    (m) => m.Create,
                  ),
              },
              {
                path: 'editar/:id',
                canActivate: [
                  permissionGuard(['inventario-herramienta:editar']),
                ],
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
                canActivate: [permissionGuard(['prestamo-herramientas:leer'])],
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
                path: 'ver/:id',
                canActivate: [
                  permissionGuard([
                    'prestamo-herramientas:leer:uno',
                    'prestamo-herramientas:autorizar',
                    'prestamo-herramientas:entregar',
                  ]),
                ],
                loadComponent: () =>
                  import('@ui/pages/tool-loans/loans/view/view').then(
                    (m) => m.View,
                  ),
              },
            ],
          },
        ],
      },
    ],
  },

  {
    path: 'firma-herramientas/:id/:type',
    loadComponent: () =>
      import('@ui/template/signature/signature').then((m) => m.Signature),
  },

  {
    path: 'prestamo-herramientas',
    loadComponent: () =>
      import('@ui/pages/tool-loans/loans/public/public').then((m) => m.Public),
  },

  {
    path: 'pase-salida/:id',
    loadComponent: () =>
      import('@ui/pages/tool-loans/loans/exit-loan/exit-loan').then(
        (m) => m.ExitLoan,
      ),
  },

  {
    path: 'cambiar-contraseña',
    loadComponent: () =>
      import('@ui/template/change-password/change-password').then(
        (m) => m.ChangePassword,
      ),
  },

  // --- COMODÍN ---
  { path: '**', redirectTo: 'iniciar-sesion' },
];
