import { Location } from '@angular/common';
import {
  Component,
  computed,
  effect,
  inject,
  resource,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IPage, IPermission } from '@domain/permission/permission.model';
import { FindAllPermissionsUseCase } from '@domain/permission/usecase/findAllPermissions.usecase';
import { RoleModel } from '@domain/role/role.model';
import { CreateRoleUseCase } from '@domain/role/usecase/createRole.usecase';
import { UpdateRoleUseCase } from '@domain/role/usecase/updateRole.usecase';
import { FindOneRoleUseCase } from '@domain/role/usecase/findOneRole.usecase';
import { Loader } from '@ui/icons/loader';
import { ToastrService } from 'ngx-toastr';
import { firstValueFrom, flatMap } from 'rxjs';

@Component({
  selector: 'app-create',
  imports: [Loader, FormsModule],
  templateUrl: './create.html',
  styleUrl: './create.scss',
})
export class Create {
  toastr = inject(ToastrService);
  private location = inject(Location);
  private router = inject(Router);
  route = inject(ActivatedRoute);

  findAllPermissions = inject(FindAllPermissionsUseCase);
  findOneRole = inject(FindOneRoleUseCase);
  createPermission = inject(CreateRoleUseCase);
  updateRole = inject(UpdateRoleUseCase);

  roleId = signal<string>('');
  roleName = signal<string>('');
  roleDescription = signal<string>('');

  permissions = resource({
    loader: async () =>
      await firstValueFrom(this.findAllPermissions.execute({})),
  });

  role = resource({
    loader: async () =>
      await firstValueFrom(
        this.findOneRole.execute({
          roleId: this.route.snapshot.paramMap.get('id') ?? undefined,
        }),
      ),
  });

  sPermission = new Set<string>();

  expandedItems = new Set<string>([]);

  constructor() {
    effect(() => {
      const data = this.role.value();

      if (!data) return;

      this.roleId.set(data.roleId ?? '');
      this.roleName.set(data.roleName ?? '');
      this.roleDescription.set(data.roleDescription ?? '');
      this.sPermission = new Set<string>(
        data.permission.map((_a) => _a.permissionId),
      );
    });
  }

  transformData(): RoleModel {
    return {
      roleId: this.roleId(),
      roleName: this.roleName(),
      roleDescription: this.roleDescription(),
      rolePriority: 0,
      permission: [...this.sPermission].map((a) => ({
        permissionId: a,
      })),
    };
  }

  update() {
    firstValueFrom(this.updateRole.execute(this.transformData())).then((rs) => {
      if (rs > 0) {
        this.toastr.success(
          'El rol se ha actualizado exitosamente.',
          'Edición de Rol',
        );
      } else {
        this.toastr.error('Ha ocurrido un error.', 'Edición de Rol');
      }
    });
  }

  save() {
    firstValueFrom(this.createPermission.execute(this.transformData())).then(
      (rs) => {
        if (rs.roleId) {
          this.toastr.success(
            'El rol se ha creado exitosamente.',
            'Creación de Rol',
          );
          this.router.navigate(['configuraciones/permisos/editar', rs.roleId], {
            replaceUrl: true,
          });
        }
      },
    );
  }

  goBack(): void {
    this.location.back();
  }

  selectAll(arr: IPage[] | IPermission[]) {
    const a = this.flatArr(arr);

    const b = a.every((_a) => this.sPermission.has(_a.permissionId));

    a.forEach((_a) =>
      b
        ? this.sPermission.delete(_a.permissionId)
        : this.sPermission.add(_a.permissionId),
    );
  }

  isSelected(arr: IPage[] | IPermission[]) {
    const a = this.flatArr(arr);

    return a.every((_a) => this.sPermission.has(_a.permissionId));
  }

  flatArr(arr: IPage[] | IPermission[]) {
    return arr.flatMap((_a) =>
      'permissions' in _a ? _a.permissions : (_a as IPermission),
    );
  }
}
