import {
  Component,
  computed,
  inject,
  OnDestroy,
  OnInit,
  resource,
  signal,
} from '@angular/core';
import { Loader } from '@ui/icons/loader';
import { Router } from '@angular/router';
import { SaveNavigationStateUseCase } from '@domain/navigation/usecase/save-navigation-state.usecase';
import { GetNavigationStateUseCase } from '@domain/navigation/usecase/get-navigation-state.usecase';
import { firstValueFrom, timestamp } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { FindAllToolsUseCase } from '@domain/tool/usecase/findAllTools.usecase';
import { ToolModel } from '@domain/tool/tool.model';
import { DeleteToolUseCase } from '@domain/tool/usecase/deleteTool.usecase';

interface Card {
  data: string;
  subtitle: string;
  iconName: string;
  bgColor: string;
}

@Component({
  selector: 'app-dashboard',
  imports: [Loader, FormsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit, OnDestroy {
  /**
   * UseCases
   */
  private saveNavigationStateUseCase = inject(SaveNavigationStateUseCase);
  private getNavigationStateUseCase = inject(GetNavigationStateUseCase);
  private findAllTools = inject(FindAllToolsUseCase);
  private deleteTool = inject(DeleteToolUseCase);

  private router = inject(Router);

  private readonly COMPONENT_KEY = 'tool-inventory-dashboard';

  cards: Card[] = [
    {
      data: '5',
      subtitle: 'Herramientas',
      iconName: 'tool',
      bgColor: 'bg-blue-200',
    },
    {
      data: '5',
      subtitle: 'Herramientas Disponibles',
      iconName: 'active',
      bgColor: 'bg-green-200',
    },
    {
      data: '5',
      subtitle: 'Herramientas Prestadas',
      iconName: 'inactive',
      bgColor: 'bg-red-200',
    },
  ];

  toolsResource = resource({
    loader: async () => await firstValueFrom(this.findAllTools.execute({})),
  });

  selection = signal(new Set<string>());

  readonly selectedCount = computed(() => this.selection().size);

  readonly canEdit = computed(() => this.selectedCount() !== 1);

  async ngOnInit(): Promise<void> {
    const savedState = await firstValueFrom(
      this.getNavigationStateUseCase.execute({
        componentKey: this.COMPONENT_KEY,
      }),
    );
    if (savedState) {
      this.restoreState(savedState);
    }
  }

  ngOnDestroy(): void {
    const currentState = {
      selection: Array.from(this.selection()),
      timestamp: new Date(),
    };

    firstValueFrom(
      this.saveNavigationStateUseCase.execute({
        componentKey: this.COMPONENT_KEY,
        state: currentState,
        timestamp: new Date(),
      }),
    ).catch((error) => {
      console.error('Error al guardar estado de navegación', error);
    });
  }

  private restoreState(state: any): void {
    if (state) {
      this.selection.set(new Set<string>(state.data.sTool));
    }
  }

  toggleSelection(id: string): void {
    this.selection.update((set) => {
      const next = new Set(set);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  navigate(type: number) {
    if (type === 2) {
      this.router.navigate([
        '/herramientas/inventario/editar',
        Array.from(this.selection())[0],
      ]);
    } else {
      this.router.navigate(['/herramientas/inventario/crear']);
    }
  }

  onDelete() {
    console.log(this.canEdit());
    if (!this.canEdit()) {
      firstValueFrom(this.deleteTool.execute(Array.from(this.selection())[0]));
    }
  }
}
