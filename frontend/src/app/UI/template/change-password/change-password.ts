import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { firstValueFrom } from 'rxjs';
import { ChangePassUseCase } from '@domain/user/usecase/changePass.usecase';
import { validate } from 'uuid';

@Component({
  selector: 'app-change-password',
  imports: [],
  templateUrl: './change-password.html',
  styleUrl: './change-password.scss',
})
export class ChangePassword {
  private readonly router = inject(Router);
  private readonly toastr = inject(ToastrService);
  private readonly changePasswordUseCase = inject(ChangePassUseCase);

  newPassword = signal('');
  confirmPassword = signal('');
  showNewPassword = signal(false);
  showConfirmPassword = signal(false);
  isLoading = signal(false);

  get passwordsMatch(): boolean {
    return (
      this.newPassword().length === 0 ||
      this.newPassword() === this.confirmPassword()
    );
  }

  get isValid(): boolean {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[ñÑ!@#$%^&*()-_=+]).{8,}$/;
    return (
      this.newPassword().length >= 8 &&
      passwordRegex.test(this.newPassword()) &&
      this.passwordsMatch
    );
  }

  async onSubmit(event: Event) {
    event.preventDefault();

    if (!this.isValid) {
      this.toastr.warning('Verifica que la contraseña cumpla los requisitos.');
      return;
    }

    this.isLoading.set(true);
    try {
      const response = await firstValueFrom(
        this.changePasswordUseCase.execute({
          pass: this.newPassword(),
          userId: '',
          changePassword: false,
        }),
      );

      if (validate(response)) {
        this.toastr.success('Contraseña actualizada exitosamente');
        this.router.navigate(['/'], { replaceUrl: true });
      }
    } catch {
      this.toastr.error('Error al actualizar la contraseña. Intenta de nuevo.');
    } finally {
      this.isLoading.set(false);
    }
  }
}
