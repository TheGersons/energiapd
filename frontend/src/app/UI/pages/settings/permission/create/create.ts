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
    params: () => {
      const id = this.route.snapshot.paramMap.get('id');
      return id ? { roleId: id } : undefined;
    },
    loader: async ({ params }) => {
      return await firstValueFrom(this.findOneRole.execute(params));
    },
  });

  permissionStates = computed(() => {
    const selected = this.sPermission();
    const structure = this.structureMap();
    const stateMap = new Map<
      string,
      { checked: boolean; indeterminate: boolean; count: string }
    >();

    structure.forEach((permissionIds, id) => {
      const total = permissionIds.length;
      if (total === 0) {
        stateMap.set(id, {
          checked: false,
          indeterminate: false,
          count: '0 de 0',
        });
        return;
      }

      const selectedCount = permissionIds.filter((id) =>
        selected.has(id),
      ).length;

      stateMap.set(id, {
        checked: selectedCount === total,
        indeterminate: selectedCount > 0 && selectedCount < total,
        count: `${selectedCount} de ${total}`,
      });
    });

    return stateMap;
  });

  structureMap = computed(() => {
    const modules = this.permissions.value() ?? [];
    const map = new Map<string, string[]>();

    modules.forEach((mod) => {
      const allModulePermissionIds = mod.pages.flatMap(
        (page) => page.permissions?.map((p) => p.permissionId) ?? [],
      );
      map.set(mod.permissionId, allModulePermissionIds);

      mod.pages.forEach((page) => {
        const pagePermissionIds =
          page.permissions?.map((p) => p.permissionId) ?? [];
        map.set(page.pageId, pagePermissionIds);
      });
    });
    return map;
  });

  sPermission = signal(new Set<string>());

  expandedItems = signal(new Set<string>());

  constructor() {
    effect(() => {
      const data = this.role.value();

      if (!data) return;

      this.roleId.set(data.roleId ?? '');
      this.roleName.set(data.roleName ?? '');
      this.roleDescription.set(data.roleDescription ?? '');
      this.sPermission.set(
        new Set(data.permission.map((_a) => _a.permissionId)),
      );
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

  selectAll(id: string) {
    const idsToToggle = this.structureMap().get(id) ?? [];
    const currentState = this.permissionStates().get(id);

    this.sPermission.update((prev) => {
      const next = new Set(prev);

      if (currentState?.checked) {
        idsToToggle.forEach((pId) => next.delete(pId));
      } else {
        idsToToggle.forEach((pId) => next.add(pId));
      }

      return next;
    });
  }

  togglePermission(id: string) {
    this.sPermission.update((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  toggleExpand(id: string) {
    this.expandedItems.update((_a) => {
      const _b = new Set(_a);
      _b.has(id) ? _b.delete(id) : _b.add(id);
      return _b;
    });
  }
}
