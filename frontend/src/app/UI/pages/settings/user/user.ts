import { NgClass } from '@angular/common';
import {
  Component,
  HostListener,
  inject,
  resource,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FindAllRolesUseCase } from '@domain/role/usecase/findAllRoles.usecase';
import { CreateUserUseCase } from '@domain/user/usecase/createUser.usecase';
import { FindAllUsersUseCase } from '@domain/user/usecase/findAllUsers.usecase';
import { UserModel } from '@domain/user/user.model';
import { ToastrService } from 'ngx-toastr';
import { firstValueFrom } from 'rxjs';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'app-user',
  imports: [NgClass, FormsModule, NgSelectModule],
  templateUrl: './user.html',
  styleUrl: './user.scss',
})
export class User {
  /**
   * Usecases
   */
  private findAllUsersUseCase = inject(FindAllUsersUseCase);
  private createUserUseCase = inject(CreateUserUseCase);
  private findAllRolesUseCase = inject(FindAllRolesUseCase);

  /**
   * Toastr Service
   */
  private toastrService = inject(ToastrService);

  /**
   * User Properties
   */
  userId = signal<string>('');
  username = signal<string>('');
  userPass = signal<string>('');
  userMail = signal<string>('');
  userFullName = signal<string>('');
  userRoleId = signal<string>('');
  userStatus = signal<boolean>(true);

  /**
   * Contains the selected User
   */
  userSelection = signal<UserModel | undefined>(undefined);

  /**
   * Boolean for hide or show modal window
   */
  toggleModal = signal<boolean>(false);

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

  onToggleModal() {
    this.toggleModal.set(!this.toggleModal());
  }

  users = resource({
    loader: async () =>
      await firstValueFrom(this.findAllUsersUseCase.execute()),
  });

  roles = resource({
    loader: async () =>
      await firstValueFrom(this.findAllRolesUseCase.execute({})),
  });

  onSave() {
    if (
      !this.username() ||
      !this.userPass() ||
      !this.userMail() ||
      !this.userFullName() ||
      !this.userRoleId()
    ) {
      return;
    }

    if (this.userSelection()) {
      // Update User logic here
    }

    firstValueFrom(
      this.createUserUseCase.execute({
        username: this.username(),
        userPass: this.userPass(),
        userMail: this.userMail(),
        userFullName: this.userFullName(),
        userRoleId: this.userRoleId(),
        userStatus: true,
      }),
    )
      .then((rs) => {
        if (rs.userId) {
          this.toastrService.success(
            'Usuario creado con exito',
            'Creación de Usuario',
          );
        }
      })
      .then(() => {
        this.users.reload();
      })
      .catch((err) => {
        this.toastrService.error(
          'Error al crear el usuario',
          'Creación de Usuario',
        );
      });
  }
}
