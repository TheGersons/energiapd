import { NgClass } from '@angular/common';
import { Component, Input, signal } from '@angular/core';
import { ModuleModel, PageModel } from '@domain/module/module.model';
import { Loader } from '@ui/icons/loader';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-aside',
  imports: [NgClass, Loader, RouterLink, RouterLinkActive],
  templateUrl: './aside.html',
  styleUrl: './aside.scss',
})
export class Aside {
  @Input() toggleSidebar = signal<boolean>(false);

  pages = signal<PageModel[]>([]);

  modules: ModuleModel[] = [
    {
      moduleId: 'tool-loans',
      moduleName: 'tool-loans',
      moduleLabel: 'Préstamo de Herramientas',
      page: [
        {
          pageId: 'inventory',
          moduleId: 'tool-loans',
          pageName: 'inventory',
          pageLabel: 'Inventario',
          pageUrl: '/herramientas/inventario',
          pageDescription: 'Inventario de Herramientas',
        },
      ],
    },
    {
      moduleId: 'settings',
      moduleName: 'settings',
      moduleLabel: 'Configuraciones',
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

  sModule = signal(new Set<string>());

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
