import { Component, inject, signal } from '@angular/core';
import {
  form,
  pattern,
  required,
  submit,
  FormField,
} from '@angular/forms/signals';
import { ToastrService } from 'ngx-toastr';
import { Loader } from '@ui/icons/loader';
import { firstValueFrom } from 'rxjs';
import { ForgotPasswordUseCase } from '@domain/auth/usecase/forgotPassword.usecase';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-forgot-pass',
  imports: [FormField, Loader, RouterLink],
  templateUrl: './forgot-pass.html',
  styleUrl: './forgot-pass.scss',
})
export class ForgotPass {
  private readonly toastr = inject(ToastrService);
  private readonly forgotPassword = inject(ForgotPasswordUseCase);

  formModel = signal({ userMail: '' });

  form = form(this.formModel, (fields) => {
    required(fields.userMail, { message: 'Este campo es requerido.' });
    pattern(fields.userMail, /^[^\s@]+@[^\s@]+\.[^\s@]+$/, {
      message: 'Correo no válido.',
    });
  });

  isLoading = signal(false);
  sent = signal(false);

  async onSubmit(event: Event) {
    event.preventDefault();
    this.isLoading.set(true);

    try {
      await submit(this.form, async () => {
        await firstValueFrom(
          this.forgotPassword.execute(this.form().controlValue().userMail),
        );
        this.sent.set(true);
      });
    } catch (error) {
      this.toastr.error('Ocurrió un error. Intenta de nuevo más tarde.');
    } finally {
      this.isLoading.set(false);
    }
  }
}
