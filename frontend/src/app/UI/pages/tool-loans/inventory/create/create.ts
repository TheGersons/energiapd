import { Location } from '@angular/common';
import {
  Component,
  effect,
  inject,
  resource,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CreateToolUseCase } from '@domain/tool/usecase/createTool.usecase';
import { FindOneToolUseCase } from '@domain/tool/usecase/findOneTool.usecase';
import { UpdateToolUseCase } from '@domain/tool/usecase/updateTool.usecase';
import { Loader } from '@ui/icons/loader';
import { ToastrService } from 'ngx-toastr';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-create',
  imports: [Loader, FormsModule],
  templateUrl: './create.html',
  styleUrl: './create.scss',
})
export class Create {
  private location = inject(Location);

  toolId = signal<string>('');
  toolName = signal<string>('');
  toolDescription = signal<string>('');
  toolBrand = signal<string>('');
  toolModel = signal<string>('');
  toolSerial = signal<string>('');
  toolImg = signal<string>('');

  private createTool = inject(CreateToolUseCase);
  private updateTool = inject(UpdateToolUseCase);

  route = inject(ActivatedRoute);

  private findOneTool = inject(FindOneToolUseCase);

  tool = resource({
    loader: async () =>
      await firstValueFrom(
        this.findOneTool.execute({
          toolId: this.route.snapshot.paramMap.get('id') ?? undefined,
        }),
      ),
  });

  /**
   * Toastr Service
   */
  private toastr = inject(ToastrService);

  constructor() {
    effect(() => {
      const data = this.tool.value();

      if (!data) return;

      this.toolId.set(data.toolId ?? '');
      this.toolName.set(data.toolName ?? '');
      this.toolDescription.set(data.toolDescription ?? '');
      this.toolBrand.set(data.toolBrand ?? '');
      this.toolModel.set(data.toolModel ?? '');
      this.toolSerial.set(data.toolSerial ?? '');
      this.toolImg.set(data.toolImg ?? '');
    });
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
      input.value = ''; // permite subir el mismo archivo otra vez
    }
  }

  private addFiles(fileList: FileList) {
    this.files.push(...Array.from(fileList));
  }

  save(): void {
    if (this.toolId()) {
      firstValueFrom(
        this.updateTool.execute({
          toolId: this.toolId(),
          toolBrand: this.toolBrand(),
          toolName: this.toolName(),
          toolDescription: this.toolDescription(),
          toolModel: this.toolModel(),
          toolSerial: this.toolSerial(),
          toolImg: this.toolImg(),
          toolStatus: true,
        }),
      ).then((rs) => {
        if (rs > 0) {
          this.toastr.success(
            'Registro actualizado con exito.',
            'Edición de Herramienta',
          );
        }
      });
    } else {
      firstValueFrom(
        this.createTool.execute({
          toolBrand: this.toolBrand(),
          toolName: this.toolName(),
          toolDescription: this.toolDescription(),
          toolModel: this.toolModel(),
          toolSerial: this.toolSerial(),
          toolImg: this.toolImg(),
          toolStatus: true,
        }),
      ).then((rs) => {
        if (rs.toolId) {
          this.toastr.success(
            'Registro creado con exito.',
            'Creación de Herramienta',
          );
        }
      });
    }
  }
}
