import {
  Component,
  computed,
  inject,
  OnDestroy,
  OnInit,
  resource,
} from '@angular/core';
import { Loader } from '@ui/icons/loader';
import { Router } from '@angular/router';
import { SaveNavigationStateUseCase } from '@domain/navigation/usecase/save-navigation-state.usecase';
import { GetNavigationStateUseCase } from '@domain/navigation/usecase/get-navigation-state.usecase';
import { firstValueFrom, timestamp } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { FindAllToolsUseCase } from '@domain/tool/usecase/findAllTools.usecase';
import { ToolModel } from '@domain/tool/tool.model';

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

  private router = inject(Router);

  private readonly COMPONENT_KEY = 'tool-inventory-dashboard';

  canEdit = computed(() => this.sTool.size === 1);

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

  tools = resource({
    loader: async () => await firstValueFrom(this.findAllTools.execute({})),
  });

  sTool = new Set<string>();

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
      sTool: Array.from(this.sTool),
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
      this.sTool = new Set<string>(state.data.sTool);
    }
  }

  onSelectRow(row: ToolModel) {
    if (this.sTool.has(row.toolId as string)) {
      this.sTool.delete(row.toolId as string);
      return;
    }

    this.sTool.add(row.toolId as string);
  }

  navigate() {
    let id;
    if (this.sTool.size === 1) {
      id = Array.from(this.sTool)[0];
      this.router.navigate(['/prestamo-herramientas/inventario/editar', id]);
      return;
    }
    this.router.navigate(['/prestamo-herramientas/inventario/crear']);
  }
}
