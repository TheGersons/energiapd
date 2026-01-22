import { NgClass } from '@angular/common';
import { Component, inject, Input, resource, signal } from '@angular/core';
import { PageModel } from '@domain/module/module.model';
import { GetAllModulesWitPages } from '@domain/module/usecase/getAllModulesWithPages.usecase';
import { Loader } from '@ui/icons/loader';
import { firstValueFrom } from 'rxjs';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-aside',
  imports: [NgClass, Loader, RouterLink],
  templateUrl: './aside.html',
  styleUrl: './aside.scss',
})
export class Aside {
  @Input() toggleSidebar = signal<boolean>(false);

  /**
   * Usecases
   */
  private findAllModulesWithPages = inject(GetAllModulesWitPages);

  pages = signal<PageModel[]>([]);

  modules = resource({
    loader: () => firstValueFrom(this.findAllModulesWithPages.execute({})),
  });

  onToggleSidebar() {
    this.toggleSidebar.set(!this.toggleSidebar());
  }

  onClickModule(pages: PageModel[]) {
    this.pages.set(pages);
    if (!this.toggleSidebar()) this.onToggleSidebar();
  }
}
