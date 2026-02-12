import { Location } from '@angular/common';
import {
  Component,
  computed,
  effect,
  inject,
  resource,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { form, required, submit, FormField } from '@angular/forms/signals';
import { ActivatedRoute, Router } from '@angular/router';
import { ToolModel } from '@domain/tool/tool.model';
import { CreateToolUseCase } from '@domain/tool/usecase/createTool.usecase';
import { FindOneToolUseCase } from '@domain/tool/usecase/findOneTool.usecase';
import { UpdateToolUseCase } from '@domain/tool/usecase/updateTool.usecase';
import { Loader } from '@ui/icons/loader';
import { ToastrService } from 'ngx-toastr';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [Loader, FormsModule, FormField],
  templateUrl: './create.html',
  styleUrl: './create.scss',
})
export class Create {
  private location = inject(Location);

  toolModel = signal<ToolModel>({
    toolId: '',
    toolName: '',
    toolDescription: '',
    toolBrand: '',
    toolModel: '',
    toolSerial: '',
    toolImg: '',
    toolAvailable: true,
    toolCode: '',
  });

  toolForm = form(this.toolModel, (fields) => {
    required(fields.toolName, { message: 'Este campo es requerido.' });

    required(fields.toolCode, { message: 'Este campo es requerido.' });
  });

  private createTool = inject(CreateToolUseCase);
  private updateTool = inject(UpdateToolUseCase);

  route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  private findOneTool = inject(FindOneToolUseCase);

  toolResource = resource({
    params: () => this.route.snapshot.paramMap.get('id'),
    loader: async ({ params: id }) => {
      if (!id) return null;
      return await firstValueFrom(this.findOneTool.execute({ toolId: id }));
    },
  });

  isEditMode = computed(() => !!this.route.snapshot.paramMap.get('id'));

  /**
   * Toastr Service
   */
  private toastr = inject(ToastrService);

  constructor() {
    effect(() => {
      const data = this.toolResource.value();

      if (data) {
        setTimeout(() => this.patchForm(data));
      }
    });
  }

  private patchForm(data: ToolModel): void {
    this.toolForm.toolId?.().setControlValue(data.toolId ?? '');
    this.toolForm.toolName?.().setControlValue(data.toolName);
    this.toolForm.toolDescription?.().setControlValue(data.toolDescription);
    this.toolForm.toolBrand?.().setControlValue(data.toolBrand);
    this.toolForm.toolModel?.().setControlValue(data.toolModel);
    this.toolForm.toolSerial?.().setControlValue(data.toolSerial);
    this.toolForm.toolImg?.().setControlValue(data.toolImg);
    this.toolForm.toolAvailable?.().setControlValue(data.toolAvailable);
    this.toolForm.toolCode?.().setControlValue(data.toolCode);
  }

  goBack(): void {
    this.location.back();
  }

  isDragging = false;
  files: File[] = [];

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    this.isDragging = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragging = false;

    if (event.dataTransfer?.files?.length) {
      this.addFiles(event.dataTransfer.files);
    }
  }

  onFileSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.addFiles(input.files);
      input.value = '';
    }
  }

  private addFiles(fileList: FileList) {
    this.files.push(...Array.from(fileList));
  }

  async onCreate(event: Event) {
    event.preventDefault();
    try {
      await submit(this.toolForm, async () => {
        const toolForm = this.toolForm().controlValue();

        const response = await firstValueFrom(
          this.createTool.execute({ ...toolForm, toolId: undefined }),
        );

        if (response.toolId) {
          this.toastr.success('Herramienta guardadad exitosamente');
          this.router.navigate(
            ['/herramientas/inventario/editar', response.toolId],
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

  async onUpdate(event: Event) {
    event.preventDefault();

    try {
      const toolForm = this.toolForm().controlValue();

      const response = await firstValueFrom(this.updateTool.execute(toolForm));

      if (response > 0) {
        this.toastr.success('Usuario actualizado exitosamente');
      }
    } catch (error) {
      this.toastr.error('Verifique los campos del formulario');
    }
  }

  isFieldInvalid(fieldName: keyof ToolModel): boolean {
    const field = (this.toolForm as any)[fieldName]?.();
    return !!(field?.touched() && field?.errors().length > 0);
  }
}
