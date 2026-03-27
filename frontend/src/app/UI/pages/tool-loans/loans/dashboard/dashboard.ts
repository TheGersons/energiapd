import { DatePipe } from '@angular/common';
import { Component, computed, inject, resource, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { FindAllLoansUseCase } from '@domain/loan/usecase/FindAllLoans.usecase';
import { Loader } from '@ui/icons/loader';
import { HasPermissionDirective } from '@base/directive/has-permission.directive';
import { firstValueFrom } from 'rxjs';

type StatusFilter =
  | 'Todos'
  | 'Pendiente'
  | 'Aprobado'
  | 'Entregado'
  | 'Devuelto'
  | 'Denegado';

@Component({
  selector: 'app-dashboard',
  imports: [Loader, HasPermissionDirective, FormsModule, DatePipe],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  private readonly router = inject(Router);
  private findAllLoansUseCase = inject(FindAllLoansUseCase);

  selection = signal(new Set<string>());
  canEdit = computed(() => this.selection().size === 1);

  searchQuery = signal('');
  statusFilter = signal<StatusFilter>('Todos');

  readonly statusTabs: StatusFilter[] = [
    'Todos',
    'Pendiente',
    'Aprobado',
    'Entregado',
    'Devuelto',
    'Denegado',
  ];

  loansResource = resource({
    loader: () => firstValueFrom(this.findAllLoansUseCase.execute()),
  });

  stats = computed(() => {
    const loans = this.loansResource.value() ?? [];
    return {
      total: loans.length,
      pendiente: loans.filter((l) => l.loanStatus === 'Pendiente').length,
      aprobado: loans.filter((l) => l.loanStatus === 'Aprobado').length,
      entregado: loans.filter((l) => l.loanStatus === 'Entregado').length,
      devuelto: loans.filter((l) => l.loanStatus === 'Devuelto').length,
      denegado: loans.filter((l) => l.loanStatus === 'Denegado').length,
    };
  });

  filteredLoans = computed(() => {
    const loans = this.loansResource.value() ?? [];
    const query = this.searchQuery().trim().toLowerCase();
    const status = this.statusFilter();

    return loans.filter((loan) => {
      const matchesStatus = status === 'Todos' || loan.loanStatus === status;
      const matchesQuery =
        !query ||
        loan.loanName.toLowerCase().includes(query) ||
        loan.loanDepartment?.departmentName?.toLowerCase().includes(query) ||
        loan.loanDni?.toLowerCase().includes(query);
      return matchesStatus && matchesQuery;
    });
  });

  statusBadgeClass(status: string): string {
    const map: Record<string, string> = {
      Pendiente: 'bg-amber-100  text-amber-700  border border-amber-200',
      Aprobado: 'bg-green-100  text-green-700  border border-green-200',
      Entregado: 'bg-blue-100   text-blue-700   border border-blue-200',
      Devuelto: 'bg-gray-100   text-gray-600   border border-gray-200',
      Denegado: 'bg-red-100    text-red-700    border border-red-200',
    };
    return map[status] ?? 'bg-gray-100 text-gray-600 border border-gray-200';
  }

  statusDotClass(status: string): string {
    const map: Record<string, string> = {
      Pendiente: 'bg-amber-500',
      Aprobado: 'bg-green-500',
      Entregado: 'bg-blue-500',
      Devuelto: 'bg-gray-400',
      Denegado: 'bg-red-500',
    };
    return map[status] ?? 'bg-gray-400';
  }

  tabCountClass(tab: StatusFilter): string {
    const map: Record<string, string> = {
      Todos: 'bg-gray-200   text-gray-600',
      Pendiente: 'bg-amber-100  text-amber-700',
      Aprobado: 'bg-green-100  text-green-700',
      Entregado: 'bg-blue-100   text-blue-700',
      Devuelto: 'bg-gray-100   text-gray-500',
      Denegado: 'bg-red-100    text-red-700',
    };
    return map[tab] ?? 'bg-gray-100 text-gray-500';
  }

  tabCount(tab: StatusFilter): number {
    const s = this.stats();
    const map: Record<StatusFilter, number> = {
      Todos: s.total,
      Pendiente: s.pendiente,
      Aprobado: s.aprobado,
      Entregado: s.entregado,
      Devuelto: s.devuelto,
      Denegado: s.denegado,
    };
    return map[tab];
  }

  isOverdue(returnDate: string): boolean {
    if (!returnDate) return false;
    return new Date(returnDate) < new Date();
  }

  goToCreate() {
    this.router.navigate(['/herramientas/prestamos/crear']);
  }

  goToEdit() {
    const selectedIds = Array.from(this.selection());
    if (selectedIds.length === 1) {
      this.router.navigate(['/herramientas/prestamos/ver', selectedIds[0]]);
    }
  }

  onSelectRow(id: string) {
    this.selection.update((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  isSelected(id: string): boolean {
    return this.selection().has(id);
  }
}
