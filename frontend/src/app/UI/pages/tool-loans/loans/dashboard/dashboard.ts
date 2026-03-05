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
import { ActivatedRoute, Router } from '@angular/router';
import { GetNavigationStateUseCase } from '@domain/navigation/usecase/get-navigation-state.usecase';
import { SaveNavigationStateUseCase } from '@domain/navigation/usecase/save-navigation-state.usecase';
import { Loader } from '@ui/icons/loader';
import { firstValueFrom } from 'rxjs';
import { HasPermissionDirective } from '@base/directive/has-permission.directive';
import { FindAllLoansUseCase } from '@domain/loan/usecase/FindAllLoans.usecase';

interface Card {
  data: string;
  subtitle: string;
  iconName: string;
  bgColor: string;
}

@Component({
  selector: 'app-dashboard',
  imports: [Loader, HasPermissionDirective],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  /**
   * UseCases
   */
  private findAllLoansUseCase = inject(FindAllLoansUseCase);

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

  loansResource = resource({
    loader: () => firstValueFrom(this.findAllLoansUseCase.execute()),
  });

  navigate(type: number) {
    if (type === 2) {
      const id = Array.from(this.selection())[0];
      this.router.navigate(['/herramientas/prestamos/ver', id]);
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
