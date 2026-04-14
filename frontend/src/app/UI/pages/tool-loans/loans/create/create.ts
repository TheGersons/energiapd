import { Location } from '@angular/common';
import { Component, inject, resource, signal } from '@angular/core';
import {
  form,
  FormField,
  pattern,
  required,
  submit,
  validate,
} from '@angular/forms/signals';
import { FindAllDepartmentsUseCase } from '@domain/department/usecase/findAllDepartments.usecase';
import { LoanFormModel, LoanModelDTO } from '@domain/loan/loal.model';
import { CreateLoanlUseCase } from '@domain/loan/usecase/createLoan.usecase';
import { ToolModel } from '@domain/tool/tool.model';
import { Loader } from '@ui/icons/loader';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { ToastrService } from 'ngx-toastr';
import { firstValueFrom } from 'rxjs';
import { NgSelectComponent } from '@ng-select/ng-select';
import { validate as uuid } from 'uuid';
import { FindAllPublicToolsUseCase } from '@domain/tool/usecase/findAllPublicTools.usecase';

@Component({
  selector: 'app-create',
  imports: [Loader, FormField, NgxMaskDirective, NgSelectComponent],
  templateUrl: './create.html',
  providers: [provideNgxMask()],
  styleUrl: './create.scss',
})
export class Create {
  createLoan = inject(CreateLoanlUseCase);
  findTools = inject(FindAllPublicToolsUseCase);
  findDepartments = inject(FindAllDepartmentsUseCase);
  toastr = inject(ToastrService);
  private readonly location = inject(Location);

  toolResource = resource({
    loader: () => firstValueFrom(this.findTools.execute()),
  });

  departmentsResource = resource({
    loader: () => firstValueFrom(this.findDepartments.execute()),
  });

  /** Herramientas ya agregadas al préstamo */
  tools = signal(new Set<ToolModel>());

  /** Herramientas seleccionadas temporalmente en el modal */
  sTool = signal(new Set<ToolModel>());

  /** Controla visibilidad del modal */
  toggleModal = signal<boolean>(false);

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
    validate(fields.loanReturnDate, ({ value }) => {
      if (new Date(value()) < new Date()) {
        return {
          kind: 'invalid-date',
          message: 'La fecha no puede ser menor a la actual.',
        };
      }
      return null;
    });
    required(fields.loanDepartment, { message: 'Este campo es requerido.' });
  });

  async onCreate(event: Event) {
    event.preventDefault();
    try {
      if (this.tools().size == 0) {
        throw 'Debe seleccionar por lo menos una herramienta.';
      }
      await submit(this.loanForm, async () => {
        const form = this.loanForm().controlValue();

        const dto: LoanModelDTO = {
          ...form,
          loanReturnDate: new Date(form.loanReturnDate).toISOString(),
          loanStatus: 'Pendiente',
          loanApprovedBy: '',
          loanDeliveredBy: '',
          loanTools: Array.from(this.tools()).map((a) => ({
            toolId: a.toolId ?? '',
          })),
        };

        const response = await firstValueFrom(this.createLoan.execute(dto));

        if (!uuid(response)) throw 'Ha ocurrido un error inesperado';

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

  /** Toggle selección temporal en el modal */
  onSelect(tool: ToolModel) {
    this.sTool.update((prev) => {
      const next = new Set(prev);
      next.has(tool) ? next.delete(tool) : next.add(tool);
      return next;
    });
  }

  onAddTool() {
    this.tools.update((prev) => {
      const next = new Set(prev);
      this.sTool().forEach((tool) => next.add(tool));
      return next;
    });
    this.sTool.set(new Set());
  }

  /** Quitar herramienta del carrito */
  onRemoveTool(tool: ToolModel) {
    this.tools.update((prev) => {
      const next = new Set(prev);
      next.delete(tool);
      return next;
    });
  }
}
