import { Component, computed, inject, resource, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FindAllUsersUseCase } from '@domain/user/usecase/findAllUsers.usecase';
import { Loader } from '@ui/icons/loader';
import { ToastrService } from 'ngx-toastr';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  imports: [Loader],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  selection = signal(new Set<string>());

  private toastr = inject(ToastrService);

  private findAllUsers = inject(FindAllUsersUseCase);

  private router = inject(Router);

  users = resource({
    loader: async () => await firstValueFrom(this.findAllUsers.execute({})),
  });

  canEdit = computed(() => {
    return this.selection().size !== 1;
  });

  navigate() {
    let id;
    if (this.selection().size === 1) {
      id = Array.from(this.selection())[0];
      this.router.navigate(['/configuraciones/usuarios/editar', id]);
      return;
    }
    this.router.navigate(['/configuraciones/usuarios/crear']);
  }

  onSelectRow(id: string) {
    this.selection.update((_a) => {
      const _b = new Set(_a);
      _b.has(id) ? _b.delete(id) : _b.add(id);
      return _b;
    });
  }
}
