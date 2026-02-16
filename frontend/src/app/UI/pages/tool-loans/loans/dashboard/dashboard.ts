import { DatePipe } from '@angular/common';
import {
  Component,
  computed,
  inject,
  OnDestroy,
  OnInit,
  resource,
  signal,
} from '@angular/core';
import { Router } from '@angular/router';
import { GetNavigationStateUseCase } from '@domain/navigation/usecase/get-navigation-state.usecase';
import { SaveNavigationStateUseCase } from '@domain/navigation/usecase/save-navigation-state.usecase';
import { Loader } from '@ui/icons/loader';
import { firstValueFrom } from 'rxjs';

interface Card {
  data: string;
  subtitle: string;
  iconName: string;
  bgColor: string;
}

@Component({
  selector: 'app-dashboard',
  imports: [Loader],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit, OnDestroy {
  router = inject(Router);
  /**
   * UseCases
   */
  private saveNavigationStateUseCase = inject(SaveNavigationStateUseCase);
  private getNavigationStateUseCase = inject(GetNavigationStateUseCase);

  cards: Card[] = [
    {
      data: '5',
      subtitle: 'Totales',
      iconName: 'total',
      bgColor: 'bg-blue-200',
    },
    {
      data: '3',
      subtitle: 'Pendientes',
      iconName: 'pending',
      bgColor: 'bg-gray-200',
    },
    {
      data: '3',
      subtitle: 'devueltos',
      iconName: 'check',
      bgColor: 'bg-green-200',
    },
    {
      data: '0',
      subtitle: 'Vencidos',
      iconName: 'expired',
      bgColor: 'bg-red-200',
    },
  ];

  selection = signal(new Set<string>());

  canEdit = computed(() => this.selection().size === 1);

  private readonly COMPONENT_KEY = 'tool-inventory-dashboard';

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
      sLoan: Array.from(this.selection()),
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
      this.selection.set(new Set<string>(state.data.sLool));
    }
  }

  navigate(type: number) {
    if (type === 2) {
      const id = Array.from(this.selection())[0];
      this.router.navigate(['/prestamo-herramientas/prestamos/editar', id]);
      return;
    }
    this.router.navigate(['/herramientas/prestamos/crear']);
  }

  onSelectRow(id: string) {
    this.selection.update((a) => {
      const b = new Set(a);
      b.has(id) ? b.delete(id) : b.add(id);
      return b;
    });
  }
}
