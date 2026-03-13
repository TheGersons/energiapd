import { Location } from '@angular/common';
import {
  Component,
  computed,
  effect,
  inject,
  resource,
  signal,
} from '@angular/core';
import { Loader } from '@ui/icons/loader';
import { form, FormField, required, submit } from '@angular/forms/signals';
import { DepartmentModel } from '@domain/department/department.model';
import { firstValueFrom } from 'rxjs';
import { CreateDepartmentUseCase } from '@domain/department/usecase/createDepartment.usecase';
import { validate } from 'uuid';
import { ToastrService } from 'ngx-toastr';
import { FindOneDepartmentUseCase } from '@domain/department/usecase/findOneDepartment.usecase';
import { ActivatedRoute } from '@angular/router';
import { UpdateDepartmentUseCase } from '@domain/department/usecase/updateDepartment';

@Component({
  selector: 'app-create',
  imports: [Loader, FormField],
  templateUrl: './create.html',
  styleUrl: './create.scss',
})
export class Create {
  private readonly location = inject(Location);
  private readonly route = inject(ActivatedRoute);

  private readonly createDepartment = inject(CreateDepartmentUseCase);
  private readonly findOneDepartment = inject(FindOneDepartmentUseCase);
  private readonly updateDepartemnt = inject(UpdateDepartmentUseCase);

  private readonly toastr = inject(ToastrService);

  isEditMode = computed(() => !!this.route.snapshot.paramMap.get('id'));

  departmentModel = signal<DepartmentModel>({
    departmentId: '',
    departmentName: '',
  });

  departmentForm = form(this.departmentModel, (fields) => {
    required(fields.departmentName, { message: 'Este campo es requerido.' });
  });

  departmentResource = resource({
    params: () => this.route.snapshot.paramMap.get('id'),
    loader: async ({ params: id }) => {
      if (!id) return null;
      return await firstValueFrom(this.findOneDepartment.execute(id));
    },
  });

  constructor() {
    effect(() => {
      const data = this.departmentResource.value();
      if (data) {
        setTimeout(() => this.patchForm(data));
      }
    });
  }

  private patchForm(data: DepartmentModel): void {
    console.log(data);
    this.departmentForm
      .departmentId?.()
      .setControlValue(data.departmentId ?? '');
    this.departmentForm.departmentName().setControlValue(data.departmentName);
  }

  goBack(): void {
    this.location.back();
  }

  async onCreate(event: Event) {
    event.preventDefault();
    try {
      await submit(this.departmentForm, async () => {
        const form = this.departmentForm().controlValue();

        const response = await firstValueFrom(
          this.createDepartment.execute({ ...form, departmentId: undefined }),
        );

        if (!validate(response)) throw 'Ha ocurrido un error inesperado';

        this.toastr.success('Préstamo creado exitosamente.');
      });
    } catch (error) {
      this.toastr.error(error as string);
    }
  }

  async onUpdate(event: Event) {
    event.preventDefault();
    try {
      await submit(this.departmentForm, async () => {
        const form = this.departmentForm().controlValue();

        const response = await firstValueFrom(
          this.updateDepartemnt.execute(form),
        );

        if (response > 0)
          this.toastr.success('Departamento actualizado exitosamente');
      });
    } catch (error) {
      this.toastr.error(error as string);
    }
  }

  isFieldInvalid(fieldName: keyof DepartmentModel): boolean {
    const field = (this.departmentForm as any)[fieldName]?.();
    return !!(field?.touched() && field?.errors().length > 0);
  }
}
