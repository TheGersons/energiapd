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

  sPermission = signal<Array<string>>([]);

  expandedItems = signal<Array<string>>([]);

  constructor() {
    effect(() => {
      const data = this.role.value();

      if (!data) return;

      this.roleId.set(data.roleId ?? '');
      this.roleName.set(data.roleName ?? '');
      this.roleDescription.set(data.roleDescription ?? '');
      this.sPermission.set(data.permission.map((_a) => _a.permissionId));
    });
  }

  transformData(): RoleModel {
    return {
      roleId: this.roleId(),
      roleName: this.roleName(),
      roleDescription: this.roleDescription(),
      rolePriority: 0,
      permission: [...this.sPermission()].map((a) => ({
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

    const b = a.every((_a) => this.sPermission().includes(_a.permissionId));

    this.sPermission.update((_a) => {
      a.forEach((_b) =>
        b
          ? _a.filter((_c) => _c !== _b.permissionId)
          : _a.push(_b.permissionId),
      );
      return _a;
    });

    /*  this.sPermission.update((_a) => {
      const _b = new Set(_a);
      a.forEach((_c) =>
        b ? _b.delete(_c.permissionId) : _b.add(_c.permissionId),
      );
      return _b;
    }); */
  }

  getStates(arr: IPage[] | IPermission[]): {
    checked: boolean;
    indeterminate: boolean;
  } {
    const a = this.flatArr(arr);
    if (a.length) return { checked: false, indeterminate: false };

    const b = a.filter((_a) =>
      this.sPermission().includes(_a.permissionId),
    ).length;

    return { checked: a.length === b, indeterminate: !!b && b < a.length };
  }

  flatArr(arr: IPage[] | IPermission[]) {
    return arr.flatMap((_a) =>
      'permissions' in _a ? (_a.permissions ?? []) : [_a as IPermission],
    );
  }

  toggleExpand(id: string) {
    this.expandedItems.update((_a) => {
      _a.includes(id) ? _a.filter((_b) => _b !== id) : _a.push(id);
      return _a;
    });

    /* this.expandedItems.update((_a) => {
      const _b = new Set(_a);
      _b.has(id) ? _b.delete(id) : _b.add(id);
      return _b;
    }); */
  }
}
