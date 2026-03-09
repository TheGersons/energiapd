import { NgClass } from '@angular/common';
import { Component, Input, signal } from '@angular/core';
import { ModuleModel, PageModel } from '@domain/module/module.model';
import { Loader } from '@ui/icons/loader';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { HasPermissionDirective } from '@base/directive/has-permission.directive';

@Component({
  selector: 'app-aside',
  imports: [
    NgClass,
    Loader,
    RouterLink,
    RouterLinkActive,
    HasPermissionDirective,
],
  templateUrl: './aside.html',
  styleUrl: './aside.scss',
})
export class Aside {
  @Input() toggleSidebar = signal<boolean>(false);

  pages = signal<PageModel[]>([
    {
      pageId: 'inventory',
      moduleId: 'tool-loans',
      pageName: 'inventory',
      pageLabel: 'Inventario',
      pageUrl: '/herramientas/inventario',
      pageDescription: 'Inventario de Herramientas',
    },
    {
      pageId: 'loans',
      moduleId: 'tool-loans',
      pageName: 'loans',
      pageLabel: 'Préstamos',
      pageUrl: '/herramientas/prestamos',
      pageDescription: 'Gestión de Préstamos',
    },
  ]);

  modules: ModuleModel[] = [
    {
      moduleId: 'tool-loans',
      moduleName: 'tool-loans',
      moduleLabel: 'Préstamo de Herramientas',
      permissions: [
        'inventario-herramienta:leer',
        'pestamo-herramientas:solicitar',
        'inventario-herramienta:crear',
        'pestamo-herramientas:leer',
        'pestamo-herramientas:entregar',
        'inventario-herramienta:eliminar',
        'inventario-herramienta:eliminar',
      ],
      page: [
        {
          pageId: 'inventory',
          moduleId: 'tool-loans',
          pageName: 'inventory',
          pageLabel: 'Inventario',
          pageUrl: '/herramientas/inventario',
          pageDescription: 'Inventario de Herramientas',
        },
        {
          pageId: 'loans',
          moduleId: 'tool-loans',
          pageName: 'loans',
          pageLabel: 'Préstamos',
          pageUrl: '/herramientas/prestamos',
          pageDescription: 'Gestión de Préstamos',
        },
      ],
    },
    {
      moduleId: 'settings',
      moduleName: 'settings',
      moduleLabel: 'Configuraciones',
      permissions: [
        'permisos:eliminar',
        'permisos:leer',
        'usuarios:crear',
        'usuarios:leer',
        'permisos:crear',
        'usuarios:editar',
        'usuarios:eliminar',
        'permisos:editar',
      ],
      page: [
        {
          pageId: 'permissions',
          moduleId: 'settings',
          pageName: 'permissions',
          pageLabel: 'Roles y Permisos',
          pageUrl: '/configuraciones/permisos',
          pageDescription: 'Configuración de Roles y Permisos',
        },
        {
          pageId: 'users',
          moduleId: 'settings',
          pageName: 'users',
          pageLabel: 'Usuarios',
          pageUrl: '/configuraciones/usuarios',
          pageDescription: 'Configuración de usuarios',
        },
      ],
    },
  ];

  sModule = signal(new Set<string>('tool-loans'));

  onToggleSidebar() {
    this.toggleSidebar.set(!this.toggleSidebar());
  }

  onClickModule(module: ModuleModel) {
    this.sModule.update((_a) => {
      const _b = new Set<string>().add(module.moduleId ?? '');
      return _b;
    });
    this.pages.set(module.page);
    if (!this.toggleSidebar()) this.onToggleSidebar();
  }
}
