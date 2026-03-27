import { DatePipe, Location } from '@angular/common';
import { Component, computed, inject, resource, signal } from '@angular/core';
import { Router } from '@angular/router';
import { PlaneRoleModel } from '@domain/role/role.model';
import { DeleteRoleUseCase } from '@domain/role/usecase/deleteRole.usecase';
import { FindAllRolesUseCase } from '@domain/role/usecase/findAllRoles.usecase';
import { Loader } from '@ui/icons/loader';
import { ToastrService } from 'ngx-toastr';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  imports: [Loader, DatePipe],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  private findAllRoles = inject(FindAllRolesUseCase);
  private deleteRole = inject(DeleteRoleUseCase);

  private toastr = inject(ToastrService);

  private router = inject(Router);

  selection = signal(new Set<string>());

  roles = resource({
    loader: async () => await firstValueFrom(this.findAllRoles.execute({})),
  });

  goToCreate() {
    this.router.navigate(['/configuraciones/permisos/crear']);
  }

  goToEdit() {
    const selectedIds = Array.from(this.selection());
    if (selectedIds.length === 1) {
      this.router.navigate([
        '/configuraciones/permisos/editar',
        selectedIds[0],
      ]);
    }
  }

  onSelectRow(row: PlaneRoleModel) {
    this.selection.update((set) => {
      const next = new Set(set);
      next.has(row.roleId) ? next.delete(row.roleId) : next.add(row.roleId);
      return next;
    });
  }

  delete() {
    firstValueFrom(
      this.deleteRole.execute(Array.from(this.selection())[0]),
    ).then((rs) => {
      if (rs > 0) {
        this.toastr.success(
          'Se rol se eliminó exitosamente.',
          'Eliminación de Rol',
        );
      } else {
        this.toastr.error('Ha ocurrido un error.', 'Eliminación de Rol');
      }
    });
  }
}
