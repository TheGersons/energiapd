import { Location } from '@angular/common';
import { Component, inject, resource, signal } from '@angular/core';
import { FindAllRolesUseCase } from '@domain/role/usecase/findAllRoles.usecase';
import { NgSelectModule } from '@ng-select/ng-select';
import { Loader } from '@ui/icons/loader';
import { ToastrService } from 'ngx-toastr';
import { firstValueFrom } from 'rxjs';
import { UserPayloadModel } from '@domain/user/user.model';
import {
  email,
  form,
  FormField,
  minLength,
  pattern,
  required,
  submit,
  validate,
} from '@angular/forms/signals';
import { CreateUserUseCase } from '@domain/user/usecase/createUser.usecase';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create',
  imports: [NgSelectModule, Loader, FormField],
  templateUrl: './create.html',
  styleUrl: './create.scss',
})
export class Create {
  private location = inject(Location);

  private findAllRoles = inject(FindAllRolesUseCase);
  private createUser = inject(CreateUserUseCase);

  private toastr = inject(ToastrService);
  private router = inject(Router);

  showPassword = signal(false);

  sRole = signal(new Set<string>());

  userModel = signal<UserPayloadModel>({
    userId: undefined,
    displayName: '',
    needChangePass: false,
    userMail: '',
    username: '',
    userPass: '',
    userRoles: [],
    userStatus: true,
  });

  userForm = form(this.userModel, (a) => {
    required(a.displayName, { message: 'Este campo es requerido.' });
    required(a.userMail, { message: 'Este campo es requerido.' });
    pattern(a.userMail, /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, {
      message: 'No es un correo electrónico válido.',
    });
    required(a.username, { message: 'Este campo es requerido.' });
    required(a.userPass, { message: 'Este campo es requerido.' });
    minLength(a.userRoles, 1, { message: 'Debe tener mímino un rol.' });
    pattern(
      a.userPass,
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[ñÑ!@#$%^&*()-_=+])[A-Za-z\dñÑ!@#$%^&*()-_=+]{8,}$/,
      {
        message:
          'La contraseña debe contener al menos una letra minúscula, una letra mayúscula, un número y un carácter especial, y debe tener una longitud mínima de 8 caracteres.',
      },
    );
  });

  roles = resource({
    loader: () => firstValueFrom(this.findAllRoles.execute({})),
  });

  goBack(): void {
    this.location.back();
  }

  generatePassword() {
    const caracteres =
      'abcdefghijklmnñopqrstuvwxyzABCDEFGHIJKLMNÑOPQRSTUVWXYZ0123456789!@#$%^&*()-_=+';
    const longitud = 8;

    const random = [
      'abcdefghijklmnñopqrstuvwxyz',
      'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ',
      '0123456789',
      '!@#$%^&*()-_=+',
    ].map((tipo) => tipo.charAt(Math.floor(Math.random() * tipo.length)));

    random.push(
      ...Array.from({ length: longitud - random.length }, () =>
        caracteres.charAt(Math.floor(Math.random() * caracteres.length)),
      ),
    );

    const password = random.sort(() => Math.random() - 0.5).join('');

    navigator.clipboard.writeText(password).then(() => {
      this.userForm.userPass().setControlValue(password);
      this.toastr.info('Contraseña copiada al portapapeles');
    });
  }

  onSubmit(event: Event) {
    event.preventDefault();

    submit(this.userForm, async () => {
      firstValueFrom(
        this.createUser.execute(this.userForm().controlValue()),
      ).then((rs) => {
        if (rs.userId) {
          this.toastr.success(
            'El usuario se ha creado exitosamente.',
            'Creación de Usuario',
          );
          this.router.navigate(['configuraciones/usuarios/editar', rs.userId], {
            replaceUrl: true,
          });
        } else {
          this.toastr.error('Ha ocurrido un erroro', 'Creación de Usuario');
        }
      });
    }).catch((e) => {
      console.log('este es un errro');
    });
  }

  isFieldlValid(fieldName: keyof UserPayloadModel): boolean {
    const fieldSignal = this.userForm[fieldName];
    if (!fieldSignal) return false;

    return (
      fieldSignal() &&
      fieldSignal().touched() &&
      fieldSignal().errors().length > 0
    );
  }
}
