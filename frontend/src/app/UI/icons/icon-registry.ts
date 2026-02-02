import { Injectable, Type } from '@angular/core';

type IconLoader = () => Promise<Type<any>>;

@Injectable({
  providedIn: 'root',
})
export class IconRegistry {
  private registry = new Map<string, IconLoader>();

  constructor() {
    this.registry.set('settings', () =>
      import('./svg/settings').then((m) => m.Settings),
    );
    this.registry.set('inventory', () =>
      import('./svg/inventory').then((m) => m.Inventory),
    );
    this.registry.set('tool-loans', () =>
      import('./svg/loan-tools').then((m) => m.LoanTools),
    );
    this.registry.set('tool', () => import('./svg/tool').then((m) => m.Tool));
    this.registry.set('active', () =>
      import('./svg/active').then((m) => m.Active),
    );
    this.registry.set('inactive', () =>
      import('./svg/inactive').then((m) => m.Inactive),
    );
    this.registry.set('arrow-left', () =>
      import('./svg/arrow-left').then((m) => m.ArrowLeft),
    );
    this.registry.set('img', () => import('./svg/img').then((m) => m.Img));
    this.registry.set('expired', () =>
      import('./svg/expired').then((m) => m.Expired),
    );
    this.registry.set('check', () =>
      import('./svg/check').then((m) => m.Check),
    );
    this.registry.set('pending', () =>
      import('./svg/pending').then((m) => m.Pending),
    );
    this.registry.set('total', () =>
      import('./svg/total').then((m) => m.Total),
    );
    this.registry.set('create', () =>
      import('./svg/create').then((m) => m.Create),
    );
    this.registry.set('delete', () =>
      import('./svg/delete').then((m) => m.Delete),
    );
    this.registry.set('edit', () => import('./svg/edit').then((m) => m.Edit));
    this.registry.set('cart', () => import('./svg/cart').then((m) => m.Cart));
    this.registry.set('bell', () => import('./svg/bell').then((m) => m.Bell));
    this.registry.set('user', () => import('./svg/user').then((m) => m.User));
    this.registry.set('epd', () => import('./svg/epd').then((m) => m.Epd));
    this.registry.set('users', () =>
      import('./svg/users').then((m) => m.Users),
    );
    this.registry.set('plus', () => import('./svg/plus').then((m) => m.Plus));
    this.registry.set('generate-pass', () =>
      import('./svg/generate-pass').then((m) => m.GeneratePass),
    );
    this.registry.set('select-all', () =>
      import('./svg/select-all').then((m) => m.SelectAll),
    );
    this.registry.set('hamburger', () =>
      import('./svg/hamburger').then((m) => m.Hamburger),
    );
    this.registry.set('logout', () =>
      import('./svg/logout').then((m) => m.Logout),
    );
  }

  getIconLoader(name: string): IconLoader {
    // Retorna la función de carga o el ícono por defecto
    return this.registry.get(name) || this.registry.get('default')!;
  }
}
