import { Location } from '@angular/common';
import { Component, inject, resource, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IPermission } from '@domain/permission/permission.model';
import { FindAllPermissionsUseCase } from '@domain/permission/usecase/findAllPermissions.usecase';
import { RoleModel } from '@domain/role/role.model';
import { CreateRoleUseCase } from '@domain/role/usecase/createRole.usecase';
import { Loader } from '@ui/icons/loader';
import { ToastrService } from 'ngx-toastr';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-create',
  imports: [Loader, FormsModule],
  templateUrl: './create.html',
  styleUrl: './create.scss',
})
export class Create {
  toastr = inject(ToastrService);
  private location = inject(Location);

  findAllPermissions = inject(FindAllPermissionsUseCase);
  createPermission = inject(CreateRoleUseCase);

  roleId = signal<string>('');
  roleName = signal<string>('');
  roleDescription = signal<string>('');

  permissions = resource({
    loader: async () =>
      await firstValueFrom(this.findAllPermissions.execute({})),
  });

  sPermission = new Set<IPermission>();

  expandedItems = new Set<string>([]);

  save() {
    const permission: RoleModel = {
      roleId: this.roleId(),
      roleName: this.roleName(),
      roleDescription: this.roleDescription(),
      rolePriority: 0,
      permission: [...this.sPermission].map((a) => ({
        permissionId: a.permissionId,
      })),
    };
    firstValueFrom(this.createPermission.execute(permission)).then((rs) => {
      if (rs.roleId) {
        this.toastr.success(
          'El rol se ha creado exitosamente.',
          'Creación de Rol',
        );
      }
    });
  }

  goBack(): void {
    this.location.back();
  }

  selectAll(arr: Array<any>) {
    const ids = arr.map(a => a.pageId || a.permissionId)

    console.log(ids)
  }
}
