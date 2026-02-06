import { Location } from '@angular/common';
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
  minLength,
  submit,
  FormField,
} from '@angular/forms/signals';
import { UserPayloadModel } from '@domain/user/user.model';
import { CreateUserUseCase } from '@domain/user/usecase/createUser.usecase';
import { FindAllRolesUseCase } from '@domain/role/usecase/findAllRoles.usecase';
import { FindOneUserUseCase } from '@domain/user/usecase/findOneUser.usecase';

// UI
import { Loader } from '@ui/icons/loader';

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [NgSelectModule, Loader, FormField],
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

  // State
  showPassword = signal(false);
  isEditMode = computed(() => !!this.route.snapshot.paramMap.get('id'));

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

    minLength(fields.userRoles, 1, { message: 'Debe tener al menos un rol.' });
  });

  // Resources (Data Fetching)
  rolesResource = resource({
    loader: () => firstValueFrom(this.findAllRoles.execute({})),
  });

  userResource = resource({
    params: () => this.route.snapshot.paramMap.get('id'),
    loader: async ({ params: id }) => {
      if (!id) return null;
      return await firstValueFrom(this.findOneUser.execute({ userId: id }));
    },
  });

  constructor() {
    // Sincronizar Resource -> Form
    effect(() => {
      const data = this.userResource.value();
      if (data) {
        this.patchForm(data);
      }
    });
  }

  private patchForm(data: any): void {
    this.userForm.userId?.().setControlValue(data.userId);
    this.userForm.displayName?.().setControlValue(data.displayName);
    this.userForm.needChangePass?.().setControlValue(data.needChangePass);
    this.userForm.userMail?.().setControlValue(data.userMail);
    this.userForm.username?.().setControlValue(data.username);
    this.userForm.userStatus?.().setControlValue(data.userStatus);

    const roles =
      data.userRoles?.map((r: any) => ({
        roleId: r.roleId,
        userId: data.userId,
      })) || [];

    this.userForm.userRoles?.().setControlValue(roles);
  }

  async onSubmit(event: Event) {
    event.preventDefault();

    try {
      await submit(this.userForm, async () => {
        const payload = this.userForm().controlValue();
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

    navigator.clipboard.writeText(password);
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

  goBack(): void {
    this.location.back();
  }
}
