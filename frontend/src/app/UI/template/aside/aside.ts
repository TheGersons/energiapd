import { NgClass } from '@angular/common';
import { Component, computed, Input, signal } from '@angular/core';
import { ModuleModel, PageModel } from '@domain/module/module.model';
import { Loader } from '@ui/icons/loader';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { HasPermissionDirective } from '@base/directive/has-permission.directive';

@Component({
  selector: 'app-aside',
  imports: [
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
        'prestamo-herramientas:solicitar',
        'inventario-herramienta:crear',
        'prestamo-herramientas:leer',
        'prestamo-herramientas:entregar',
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
        {
          pageId: 'departments',
          moduleId: 'settings',
          pageName: 'departments',
          pageLabel: 'Departamentos',
          pageUrl: '/configuraciones/departamentos',
          pageDescription: 'Gestión de departamentos',
        },
      ],
    },
  ];

  sModule = signal(new Set<string>(['tool-loans']));

  /** Label del módulo activo para el header del panel */
  currentModuleLabel = computed(() => {
    const activeId = Array.from(this.sModule())[0];
    return this.modules.find(m => m.moduleId === activeId)?.moduleLabel ?? '';
  });

  onToggleSidebar() {
    this.toggleSidebar.set(!this.toggleSidebar());
  }

  onClickModule(module: ModuleModel) {
    const alreadyActive = this.sModule().has(module.moduleId ?? '');

    this.sModule.set(new Set<string>([module.moduleId ?? '']));
    this.pages.set(module.page);

    // Si el panel está cerrado, abrirlo. Si el mismo módulo se toca de nuevo, togglarlo.
    if (!this.toggleSidebar() || !alreadyActive) {
      this.toggleSidebar.set(true);
    } else {
      this.toggleSidebar.set(false);
    }
  }
}