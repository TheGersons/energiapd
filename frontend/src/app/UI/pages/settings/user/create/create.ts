import { Location, NgClass } from '@angular/common';
import {
  Component,
  computed,
  effect,
  inject,
  resource,
  signal,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { NgSelectModule } from '@ng-select/ng-select';

// Signals Forms & Domain
import {
  form,
  pattern,
  required,
  submit,
  FormField,
} from '@angular/forms/signals';
import {
  UserFormModel,
  UserPayloadModel,
  UserResponseModel,
} from '@domain/user/user.model';
import { CreateUserUseCase } from '@domain/user/usecase/createUser.usecase';
import { FindAllRolesUseCase } from '@domain/role/usecase/findAllRoles.usecase';
import { FindOneUserUseCase } from '@domain/user/usecase/findOneUser.usecase';

// UI
import { Loader } from '@ui/icons/loader';
import { FormsModule } from '@angular/forms';
import { PlaneRoleModel } from '@domain/role/role.model';
import { UpdateUserUseCase } from '@domain/user/usecase/updateUser.usecase';
import { FindAllDepartmentsUseCase } from '@domain/department/usecase/findAllDepartments.usecase';
import { DepartmentModel } from '@domain/department/department.model';
import { ChangePassUseCase } from '@domain/user/usecase/changePass.usecase';
import { validate } from 'uuid';

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [NgSelectModule, Loader, FormField, FormsModule, NgClass],
  templateUrl: './create.html',
  styleUrl: './create.scss',
})
export class Create {
  // Services
  private readonly location = inject(Location);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly toastr = inject(ToastrService);

  // Use Cases
  private readonly findAllRoles = inject(FindAllRolesUseCase);
  private readonly createUser = inject(CreateUserUseCase);
  private readonly findOneUser = inject(FindOneUserUseCase);
  private readonly updateUser = inject(UpdateUserUseCase);
  private readonly findAllDepartments = inject(FindAllDepartmentsUseCase);
  private readonly changePassword = inject(ChangePassUseCase);

  // State
  showPassword = signal(false);
  isEditMode = computed(() => !!this.route.snapshot.paramMap.get('id'));
  sRole: PlaneRoleModel[] = [];
  sDepartment?: DepartmentModel;
  showPasswordSection = signal(false);

  userModel = signal<UserFormModel>({
    userId: '',
    displayName: '',
    needChangePass: false,
    userMail: '',
    username: '',
    userPass: '',
    userStatus: true,
  });

  // Form Configuration
  userForm = form(this.userModel, (fields) => {
    required(fields.displayName, { message: 'Este campo es requerido.' });
    required(fields.userMail, { message: 'Este campo es requerido.' });
    pattern(fields.userMail, /^[^\s@]+@[^\s@]+\.[^\s@]+$/, {
      message: 'Correo no válido.',
    });
    required(fields.username, { message: 'Este campo es requerido.' });

    if (!this.isEditMode()) {
      required(fields.userPass, { message: 'Este campo es requerido.' });
    }

    pattern(
      fields.userPass,
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[ñÑ!@#$%^&*()-_=+]).{8,}$/,
      {
        message: 'La contraseña no cumple con los requisitos de seguridad.',
      },
    );
  });

  // Resources (Data Fetching)
  rolesResource = resource({
    loader: () => firstValueFrom(this.findAllRoles.execute({})),
  });

  departmentsResource = resource({
    loader: () => firstValueFrom(this.findAllDepartments.execute()),
  });

  userResource = resource({
    params: () => this.route.snapshot.paramMap.get('id'),
    loader: async ({ params: id }) => {
      if (!id) return null;
      return await firstValueFrom(this.findOneUser.execute({ userId: id }));
    },
  });

  constructor() {
    effect(() => {
      const data = this.userResource.value();
      if (data) {
        setTimeout(() => this.patchForm(data));
      }
    });
  }

  private patchForm(data: UserResponseModel): void {
    this.userForm.userId?.().setControlValue(data.userId ?? '');
    this.userForm.displayName?.().setControlValue(data.displayName);
    this.userForm.needChangePass?.().setControlValue(data.needChangePass);
    this.userForm.userMail?.().setControlValue(data.userMail);
    this.userForm.username?.().setControlValue(data.username);
    this.userForm.userStatus?.().setControlValue(data.userStatus);

    this.sRole =
      this.rolesResource
        .value()
        ?.filter((a) => data.userRoles.some((b) => a.roleId === b.roleId)) ??
      [];

    this.sDepartment = this.departmentsResource
      .value()
      ?.filter((a) => data.userDepartment.departmentId === a.departmentId)?.[0];
  }

  async onUpdate(event: Event) {
    event.preventDefault();
    try {
      await submit(this.userForm, async () => {
        const userForm = this.userForm().controlValue();

        if (!this.sDepartment) throw '';

        if (!this.sRole.length) throw '';

        const payload: UserPayloadModel = {
          ...userForm,
          userRoles: this.sRole.map((a) => ({
            roleId: a.roleId,
            userId: userForm.userId ?? '',
          })),
          userDepartment: this.sDepartment?.departmentId ?? '',
        };
        const response = await firstValueFrom(this.updateUser.execute(payload));

        if (response > 0) {
          this.toastr.success('Usuario actualizado exitosamente');
        }
      });
    } catch (error) {
      this.toastr.error('Verifique los campos del formulario');
    }
  }

  async onCreate(event: Event) {
    event.preventDefault();
    try {
      await submit(this.userForm, async () => {
        const userForm = this.userForm().controlValue();

        if (!this.sDepartment) throw '';

        if (!this.sRole.length) throw '';

        const payload: UserPayloadModel = {
          ...userForm,
          userId: undefined,
          userRoles: this.sRole.map((a) => ({
            roleId: a.roleId,
            userId: userForm.userId ?? '',
          })),
          userDepartment: this.sDepartment?.departmentId ?? '',
        };

        const response = await firstValueFrom(this.createUser.execute(payload));

        if (response?.id) {
          this.toastr.success('Usuario guardado exitosamente');
          this.router.navigate(
            ['configuraciones/usuarios/editar', response.id],
            {
              replaceUrl: true,
            },
          );
        }
      });
    } catch (error) {
      this.toastr.error('Verifique los campos del formulario');
    }
  }

  generatePassword(): void {
    const charset = {
      lower: 'abcdefghijklmnñopqrstuvwxyz',
      upper: 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ',
      num: '0123456789',
      spec: '!@#$%^&*()-_=+',
    };

    const passwordArray = [
      this.getRandomChar(charset.lower),
      this.getRandomChar(charset.upper),
      this.getRandomChar(charset.num),
      this.getRandomChar(charset.spec),
    ];

    const allChars = Object.values(charset).join('');
    for (let i = passwordArray.length; i < 12; i++) {
      passwordArray.push(this.getRandomChar(allChars));
    }

    const password = passwordArray.sort(() => Math.random() - 0.5).join('');

    if (navigator.clipboard) {
      navigator.clipboard.writeText(password);
    }
    this.userForm.userPass().setControlValue(password);
    this.toastr.info('Contraseña generada y copiada');
  }

  private getRandomChar(str: string): string {
    return str.charAt(Math.floor(Math.random() * str.length));
  }

  isFieldInvalid(fieldName: keyof UserPayloadModel): boolean {
    const field = (this.userForm as any)[fieldName]?.();
    return !!(field?.touched() && field?.errors().length > 0);
  }

  async onChangePass(event: Event) {
    event.preventDefault();
    const passwordField = this.userForm.userPass();

    passwordField.markAsTouched();

    if (passwordField.valid()) {
      const response = await firstValueFrom(
        this.changePassword.execute({
          userId: this.userForm().controlValue().userId ?? '',
          changePassword: this.userForm().controlValue().needChangePass,
          pass: this.userForm().controlValue().userPass,
        }),
      );

      if (validate(response)) {
        this.toastr.success('Contraseña cambiada con éxito.');
      } else {
        this.toastr.success('Ha ocurrido un error.');
      }
    } else {
      this.toastr.warning('La contraseña no cumple con los requisitos');
    }
  }

  goBack(): void {
    this.location.back();
  }
}
