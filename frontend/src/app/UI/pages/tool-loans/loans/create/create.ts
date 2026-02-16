import { Location } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import {
  form,
  FormField,
  pattern,
  required,
  submit,
} from '@angular/forms/signals';
import { LoanFormModel, LoanModelDTO } from '@domain/loan/loal.model';
import { CreateLoanlUseCase } from '@domain/loan/usecase/createLoan.usecase';
import { Loader } from '@ui/icons/loader';
import { ToastrService } from 'ngx-toastr';
import { firstValueFrom } from 'rxjs';
import { validate } from 'uuid';

@Component({
  selector: 'app-create',
  imports: [Loader, FormField],
  templateUrl: './create.html',
  styleUrl: './create.scss',
})
export class Create {
  createLoan = inject(CreateLoanlUseCase);
  toastr = inject(ToastrService);
  private readonly location = inject(Location);

  sTools: Array<{ toolId: string }> = [];

  loanModel = signal<LoanFormModel>({
    loanName: '',
    loanDni: '',
    loanDepartment: '',
    loanUseDescription: '',
    loanReturnDate: '',
    loanNotes: '',
  });

  loanForm = form(this.loanModel, (fields) => {
    required(fields.loanName, { message: 'Este campo es requerido.' });
    required(fields.loanDni, { message: 'Este campo es requerido.' });
    required(fields.loanReturnDate, { message: 'Este campo es requerido.' });
    required(fields.loanUseDescription, {
      message: 'Este campo es requerido.',
    });
    pattern(fields.loanDni, /^\d{4}-\d{4}-\d{5}$/, {
      message: 'Formato incorrecto.',
    });
  });

  async onCreate(event: Event) {
    event.preventDefault();
    try {
      await submit(this.loanForm, async () => {
        const form = this.loanForm().controlValue();

        const dto: LoanModelDTO = {
          ...form,
          loanStatus: 'pending',
          loanApprovedBy: '',
          loanDeliveredBy: '',
          loanTools: this.sTools,
        };

        const respone = await firstValueFrom(this.createLoan.execute(dto));

        if (!validate(respone)) throw 'Ha ocurrido un error inesperado';

        this.toastr.success('Préstamo creado exitosamente.');
      });
    } catch (err) {
      this.toastr.error(err as string);
    }
  }

  goBack(): void {
    this.location.back();
  }

  isFieldInvalid(fieldName: keyof LoanFormModel): boolean {
    const field = (this.loanForm as any)[fieldName]?.();
    return !!(field?.touched() && field?.errors().length > 0);
  }
}
