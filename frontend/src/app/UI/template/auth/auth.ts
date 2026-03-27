import { Component, inject, signal } from '@angular/core';
import { form, required, submit, FormField } from '@angular/forms/signals';
import { AuthenticateUseCase } from '@domain/auth/usecase/authenticate.usecase';
import { ToastrService } from 'ngx-toastr';
import { catchError, EMPTY, firstValueFrom } from 'rxjs';
import { RouterLink } from "@angular/router";
import { Loader } from "@ui/icons/loader";

@Component({
  selector: 'app-auth',
  imports: [FormField, RouterLink, Loader],
  templateUrl: './auth.html',
  styleUrl: './auth.scss',
})
export class Auth {
  private toastr = inject(ToastrService);
  private authenticate = inject(AuthenticateUseCase);

  isLoading = signal(false);

  showNewPassword = signal(false);

  // Modelo de datos
  authModel = signal({
    login: '',
    password: '',
  });

  authForm = form(this.authModel, (fields) => {
    required(fields.login, { message: 'Este campo es requerido.' });
    required(fields.password, { message: 'Este campo es requerido' });
  });

  async onSubmit(event: Event) {
    event.preventDefault();

    await submit(this.authForm, async () => {
      const authForm = this.authForm().controlValue();
      this.isLoading.set(true);

      firstValueFrom(
        this.authenticate.execute({
          login: authForm.login,
          password: authForm.password,
        }),
      ).catch((error) => {
        this.isLoading.set(false);
        if (error.statusCode === 401) {
          this.toastr.warning('Usuario o contraseña incorrecta');
        }
      });
    });
  }
}
