import { NgClass } from '@angular/common';
import { Component, inject, Input, resource, signal } from '@angular/core';
import { ModuleModel, PageModel } from '@domain/module/module.model';
import { Loader } from '@ui/icons/loader';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-aside',
  imports: [NgClass, Loader, RouterLink],
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
          pageUrl: '/prestamo-herramientas/inventario',
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

  onToggleSidebar() {
    this.toggleSidebar.set(!this.toggleSidebar());
  }

  onClickModule(pages: PageModel[]) {
    this.pages.set(pages);
    if (!this.toggleSidebar()) this.onToggleSidebar();
  }
}
