import { Location } from '@angular/common';
import { Component, inject, resource, signal } from '@angular/core';
import {
  form,
  FormField,
  pattern,
  required,
  submit,
} from '@angular/forms/signals';
import { LoanFormModel, LoanModelDTO } from '@domain/loan/loal.model';
import { CreateLoanlUseCase } from '@domain/loan/usecase/createLoan.usecase';
import { ToolModel } from '@domain/tool/tool.model';
import { FindAllToolsUseCase } from '@domain/tool/usecase/findAllTools.usecase';
import { Loader } from '@ui/icons/loader';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { ToastrService } from 'ngx-toastr';
import { firstValueFrom } from 'rxjs';
import { validate } from 'uuid';

@Component({
  selector: 'app-create',
  imports: [Loader, FormField, NgxMaskDirective],
  templateUrl: './create.html',
  providers: [provideNgxMask()],
  styleUrl: './create.scss',
})
export class Create {
  createLoan = inject(CreateLoanlUseCase);
  findTools = inject(FindAllToolsUseCase);
  toastr = inject(ToastrService);
  private readonly location = inject(Location);

  toolResource = resource({
    loader: () => firstValueFrom(this.findTools.execute({})),
  });

  tools = signal(new Set<ToolModel>());
  toggleModal = signal<boolean>(false);

  sTool = signal(new Set<ToolModel>());

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
    pattern(fields.loanDni, /^\d{4}\d{4}\d{5}$/, {
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
          loanReturnDate: new Date(form.loanReturnDate).toISOString(),
          loanStatus: 'pending',
          loanApprovedBy: '',
          loanDeliveredBy: '',
          loanTools: Array.from(this.tools()).map((a) => ({
            toolId: a.toolId ?? '',
          })),
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

  onSelect(id: ToolModel) {
    this.sTool.update((a) => {
      const b = new Set(a);

      b.has(id) ? b.delete(id) : b.add(id);
      return b;
    });
  }

  onAddTool() {
    this.tools.update((a) => {
      const b = new Set(a);
      const c: ToolModel[] = Array.from(this.sTool());
      c.forEach((tool) => b.add(tool));
      return b;
    });
  }

  onRemoveTool(a: ToolModel) {
    this.tools.update((_a) => {
      const b = new Set(_a);
      b.delete(a);
      return b;
    });
  }
}
