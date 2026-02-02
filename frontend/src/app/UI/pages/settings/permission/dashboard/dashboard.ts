import { Location } from '@angular/common';
import { Component, computed, inject, resource } from '@angular/core';
import { Router } from '@angular/router';
import { PlaneRoleModel } from '@domain/role/role.model';
import { DeleteRoleUseCase } from '@domain/role/usecase/deleteRole.usecase';
import { FindAllRolesUseCase } from '@domain/role/usecase/findAllRoles.usecase';
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
  private findAllRoles = inject(FindAllRolesUseCase);
  private deleteRole = inject(DeleteRoleUseCase);

  private toastr = inject(ToastrService);

  private router = inject(Router);

  selection = new Set<string>();

  roles = resource({
    loader: async () => await firstValueFrom(this.findAllRoles.execute({})),
  });

  canEdit = computed(() => this.selection.size !== 1);

  navigate() {
    let id;
    if (this.selection.size === 1) {
      id = Array.from(this.selection)[0];
      this.router.navigate(['/configuraciones/permisos/editar', id]);
      return;
    }
    this.router.navigate(['/configuraciones/permisos/crear']);
  }

  onSelectRow(row: PlaneRoleModel) {
    if (this.selection.has(row.roleId)) {
      this.selection.delete(row.roleId);
      return;
    }

    this.selection.add(row.roleId);
  }

  delete() {
    firstValueFrom(this.deleteRole.execute(Array.from(this.selection)[0])).then(
      (rs) => {
        if (rs > 0) {
          this.toastr.success(
            'Se rol se eliminó exitosamente.',
            'Eliminación de Rol',
          );
        } else {
          this.toastr.error('Ha ocurrido un error.', 'Eliminación de Rol');
        }
      },
    );
  }
}
