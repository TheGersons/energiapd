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
import { DeleteToolUseCase } from '@domain/tool/usecase/deleteTool.usecase';

type StatusFilter = 'Todos' | 'Disponible' | 'Prestadas';

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

  toolsResource = resource({
    loader: async () => await firstValueFrom(this.findAllTools.execute({})),
  });

  selection = signal(new Set<string>());

  readonly statusTabs: StatusFilter[] = ['Todos', 'Disponible', 'Prestadas'];
  searchQuery = signal('');
  statusFilter = signal<StatusFilter>('Todos');

  readonly selectedCount = computed(() => this.selection().size);

  readonly canEdit = computed(() => this.selectedCount() !== 1);

  readonly stats = computed(() => {
    const tools = this.toolsResource.value() ?? [];
    return {
      total: tools.length,
      available: tools.filter((a) => a.toolAvailable).length,
      lended: tools.filter((a) => !a.toolAvailable).length,
    };
  });

  filteredTools = computed(() => {
    const tools = this.toolsResource.value() ?? [];
    const query = this.searchQuery().trim().toLowerCase();
    const status = this.statusFilter();

    return tools.filter((tool) => {
      const matchesStatus =
        status === 'Todos' ||
        (tool.toolAvailable ? 'Disponible' : 'Prestadas') === status;
      const matchesQuery =
        !query ||
        tool.toolName?.toLowerCase().includes(query) ||
        tool.toolModel?.toLowerCase().includes(query) ||
        tool.toolBrand?.toLowerCase().includes(query);
      tool.toolSerial?.toLowerCase().includes(query);
      tool.toolCode?.toLowerCase().includes(query);
      return matchesStatus && matchesQuery;
    });
  });

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
    if (!this.canEdit()) {
      firstValueFrom(this.deleteTool.execute(Array.from(this.selection())[0]));
    }
  }

  tabCountClass(tab: StatusFilter): string {
    const map: Record<string, string> = {
      Todos: 'bg-gray-200   text-gray-600',
      Disponible: 'bg-amber-100  text-amber-700',
      Prestado: 'bg-green-100  text-green-700',
    };
    return map[tab] ?? 'bg-gray-100 text-gray-500';
  }

  tabCount(tab: StatusFilter): number {
    const s = this.stats();
    const map: Record<StatusFilter, number> = {
      Todos: s.total,
      Disponible: s.available,
      Prestadas: s.lended,
    };
    return map[tab];
  }
}
