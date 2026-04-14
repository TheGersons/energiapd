import {
  Component,
  computed,
  inject,
  Input,
  OnInit,
  signal,
} from '@angular/core';
import {
  NavigationEnd,
  Router,
  RouterLink,
  RouterLinkActive,
} from '@angular/router';
import { ModuleModel, PageModel } from '@domain/module/module.model';
import { HasPermissionDirective } from '@base/directive/has-permission.directive';
import { Loader } from '@ui/icons/loader';
import { filter } from 'rxjs';

@Component({
  selector: 'app-aside',
  imports: [Loader, RouterLink, RouterLinkActive, HasPermissionDirective],
  templateUrl: './aside.html',
  styleUrl: './aside.scss',
})
export class Aside implements OnInit {
  @Input() toggleSidebar = signal<boolean>(false);

  private readonly router = inject(Router);

  readonly modules = signal<ModuleModel[]>([
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
          permissions: ['inventario-herramienta:leer'],
        },
        {
          pageId: 'loans',
          moduleId: 'tool-loans',
          pageName: 'loans',
          pageLabel: 'Préstamos',
          pageUrl: '/herramientas/prestamos',
          pageDescription: 'Gestión de Préstamos',
          permissions: ['prestamo-herramientas:leer'],
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
          permissions: ['permisos:leer'],
        },
        {
          pageId: 'users',
          moduleId: 'settings',
          pageName: 'users',
          pageLabel: 'Usuarios',
          pageUrl: '/configuraciones/usuarios',
          pageDescription: 'Configuración de usuarios',
          permissions: ['usuarios:leer'],
        },
        {
          pageId: 'departments',
          moduleId: 'settings',
          pageName: 'departments',
          pageLabel: 'Departamentos',
          pageUrl: '/configuraciones/departamentos',
          pageDescription: 'Gestión de departamentos',
          permissions: ['departamentos:leer'],
        },
      ],
    },
  ]);

  pages = signal<PageModel[]>([]);
  sModule = signal(new Set<string>());

  currentModuleLabel = computed(() => {
    const activeId = Array.from(this.sModule())[0];
    return (
      this.modules().find((m) => m.moduleId === activeId)?.moduleLabel ?? ''
    );
  });

  modulePermissions = computed<Record<string, string[]>>(() => {
    return this.modules().reduce(
      (acc, curr) => {
        acc[curr.moduleName] = curr.page.flatMap(
          (p) => (p as any).permissions ?? [],
        );
        return acc;
      },
      {} as Record<string, string[]>,
    );
  });

  ngOnInit(): void {
    this.activateModuleForUrl(this.router.url);

    this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe((e: any) => this.activateModuleForUrl(e.urlAfterRedirects));
  }

  private activateModuleForUrl(url: string): void {
    const matched = this.modules().find((m) =>
      m.page.some((p) => url.startsWith(p.pageUrl)),
    );

    if (matched) {
      this.sModule.set(new Set([matched.moduleId ?? '']));
      this.pages.set(matched.page);
      this.toggleSidebar.set(true);
    }
  }

  onToggleSidebar() {
    this.toggleSidebar.set(!this.toggleSidebar());
  }

  onClickModule(module: ModuleModel) {
    const alreadyActive = this.sModule().has(module.moduleId ?? '');

    this.sModule.set(new Set([module.moduleId ?? '']));
    this.pages.set(module.page);

    if (!this.toggleSidebar() || !alreadyActive) {
      this.toggleSidebar.set(true);
    } else {
      this.toggleSidebar.set(false);
    }
  }
}
