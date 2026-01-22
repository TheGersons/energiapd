import { NgClass } from '@angular/common';
import {
  Component,
  HostListener,
  inject,
  linkedSignal,
  resource,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CreateRoleUseCase } from '@domain/role/usecase/createRole.usecase';
import { FindAllRolesUseCase } from '@domain/role/usecase/findAllRoles.usecase';
import { ToastrService } from 'ngx-toastr';
import { firstValueFrom, Observable } from 'rxjs';
import { RoleModel } from '@domain/role/role.model';
import { GetAllModulesWitPages } from '@domain/module/usecase/getAllModulesWithPages.usecase';
import { FindAllPermissionsByRoleUseCase } from '@domain/permission/usecase/findAllPermissionsByRole.usecase';
import { CreatePermissionForRoleUseCase } from '@domain/permission/usecase/createPermissionForRole.usecase';
import { DeletePermissionOfRoleUseCase } from '@domain/permission/usecase/deletePermissionOfRole.usecase';
import { UpdateRoleUseCase } from '@domain/role/usecase/updateRole.usecase';
import { DeleteRoleUseCase } from '@domain/role/usecase/deleteRole.usecase';

@Component({
  selector: 'app-permission',
  imports: [NgClass, FormsModule],
  templateUrl: './permission.html',
  styleUrl: './permission.scss',
})
export class Permission {
  /**
   * Usecases
   */
  private findAllRolesUseCase = inject(FindAllRolesUseCase);
  private createRoleUseCase = inject(CreateRoleUseCase);
  private getAllModulesWithPages = inject(GetAllModulesWitPages);
  private findAllPermissionsByRoleUseCase = inject(
    FindAllPermissionsByRoleUseCase,
  );
  private createPermissionForRoleUseCase = inject(
    CreatePermissionForRoleUseCase,
  );
  private deletePermissionOfRoleUseCase = inject(DeletePermissionOfRoleUseCase);
  private updateRoleUseCase = inject(UpdateRoleUseCase);
  private deleteRoleUseCase = inject(DeleteRoleUseCase);

  /**
   * Toastr Service
   */
  private toastr = inject(ToastrService);

  /**
   * Boolean for hide or show modal window
   */
  toggleModal = signal<boolean>(false);

  /**
   * Set for fold or unfold modules
   */
  foldModule = new Set<string>();

  /**
   * Role Id variable
   */
  roleId = signal<string>('');

  /**
   * Role Name variable
   */
  roleName = signal<string>('');

  /**
   * Descripton Role variable
   */
  roleDescription = signal<string>('');

  /**
   * Contains the selected Role
   */
  roleSelection = signal<RoleModel | undefined>(undefined);

  /**
   * listen for Escape button for hide the modal
   * @param event Event of keyboard Input
   */
  @HostListener('document:keydown.escape', ['$event'])
  onEscapeKey(event: Event) {
    event.stopImmediatePropagation();
    if (
      document.activeElement?.getAttribute('aria-expanded') !== 'true' &&
      this.toggleModal()
    ) {
      this.onToggleModal();
    }
  }

  /**
   * Call api to obtain all roles
   */
  roles = resource({
    loader: async () =>
      await firstValueFrom(this.findAllRolesUseCase.execute({})),
  });

  modules = resource({
    loader: async () =>
      await firstValueFrom(this.getAllModulesWithPages.execute({})),
  });

  /**
   * Fires when has been selected a role
   */
  permissionsByRole = resource({
    params: () => ({ id: this.roleSelection()?.roleId ?? '1' }),
    loader: async ({ params }) => {
      return await firstValueFrom(
        this.findAllPermissionsByRoleUseCase.execute({ roleId: params.id }),
      );
    },
  });

  /**
   * Toggle toggleModal variable for show or hide modal window
   */
  onToggleModal() {
    this.toggleModal.set(!this.toggleModal());
  }

  /**
   * Fold or unfold the module to show the pages
   * @param name Name of the module
   */
  onToggleFold(name: string) {
    if (this.foldModule.has(name)) this.foldModule.delete(name);
    else this.foldModule.add(name);
  }

  /**
   * Validates empty strings
   * Create Roles
   * Reload resouce
   * Show alert with success or error
   * @param roleName string
   * @param roleDescription string
   * @returns void
   */
  onSave(roleName: string, roleDescription: string) {
    if (!this.roleName && !this.roleDescription) return;
    if (this.roleId()) {
      firstValueFrom(
        this.updateRoleUseCase.execute({
          roleId: this.roleId(),
          roleName: this.roleName(),
          roleDescription: this.roleDescription(),
        }),
      )
        .then((rs) => {
          if (rs > 0) {
            this.toastr.success(
              'Registro actualizado con exito.',
              'Edición de Rol',
            );
          }
        })
        .then(() => this.roles.reload())
        .catch((error) => {
          this.toastr.error('Error inesperado', 'Edición de Rol');
        });
      return;
    }

    firstValueFrom(
      this.createRoleUseCase.execute({ roleName, roleDescription }),
    )
      .then((rs) => {
        if (rs.roleId) {
          this.toastr.success('Registro creado con exito.', 'Creación de Rol');
        }
      })
      .then(() => {
        this.roles.reload();
      })
      .catch((error) => {
        this.toastr.error('Error inesperado', 'Creación de Rol');
      });
  }

  /**
   * Toggle for add class to selected role
   * @param role The selected role
   */
  onSelectRole(role: RoleModel) {
    if (this.roleSelection()) {
      this.roleSelection.set(undefined);
    }
    this.roleSelection.set(role);
  }

  /**
   * Return true or false to add classes to buttons of permissions
   * @param action It can be create, edit, veiw or delete
   * @param idPage Id of page that has permissions
   * @returns boolean
   */
  hasPermission(action: string, idPage: string) {
    return this.permissionsByRole
      .value()
      ?.page.some(
        (a) =>
          a.pageId === idPage && a.permission.some((b) => b.name === action),
      );
  }

  onEditPermission(pageId: string, permissionId: string, action: string) {
    if (this.hasPermission(action, pageId)) {
      firstValueFrom(
        this.deletePermissionOfRoleUseCase.execute({
          pageId,
          permissionId,
          roleId: this.roleSelection()?.roleId as string,
        }),
      )
        .then(() => {
          this.permissionsByRole.reload();
        })
        .catch((error) => {
          this.toastr.error('Error inesperado', 'Creación de Permiso');
        });
    } else {
      firstValueFrom(
        this.createPermissionForRoleUseCase.execute({
          roleId: this.roleSelection()?.roleId as string,
          pageId,
          permissionId,
        }),
      )
        .then(() => {
          this.permissionsByRole.reload();
        })
        .catch((error) => {
          this.toastr.error('Error inesperado', 'Creación de Permiso');
        });
    }
  }

  /**
   * Open modal and set values to edit role
   * @param roleId string
   * @param roleName string
   * @param roleDescription string
   */
  onClickEditPermission(
    roleId: string,
    roleName: string,
    roleDescription: string,
  ) {
    this.roleId.set(roleId);
    this.roleName.set(roleName);
    this.roleDescription.set(roleDescription);
    this.onToggleModal();
  }

  /**
   * Delete the role
   * @param idRole string
   * @returns number
   */
  onDeleteRole(idRole: string) {
    if (!idRole) return;
    firstValueFrom(this.deleteRoleUseCase.execute({ roleId: idRole }))
      .then((rs) => {
        if (rs > 0) {
          this.toastr.success(
            'Registro eliminado con exito.',
            'Eliminación de Rol',
          );
        }
      })
      .then(() => {
        if (this.roleSelection()?.roleId) this.roleSelection.set(undefined);
        this.roles.reload();
      })
      .catch((error) => {
        this.toastr.error('Error inesperado', 'Eliminación de Rol');
      });
  }
}
