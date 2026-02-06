import { Component, computed, inject, resource, signal } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

// Icons & UI
import { Loader } from '@ui/icons/loader';

// Use Cases
import { ActiveUsersUseCase } from '@domain/user/usecase/activeUsers.usecase';
import { FindAllUsersUseCase } from '@domain/user/usecase/findAllUsers.usecase';
import { InactiveUsersUseCase } from '@domain/user/usecase/inactiveUsers.usecase';
import { TotalUsersUseCase } from '@domain/user/usecase/totalUsers.usecase';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [Loader],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  // Services
  private readonly router = inject(Router);
  private readonly toastr = inject(ToastrService);

  // Use Cases
  private readonly findAllUsers = inject(FindAllUsersUseCase);
  private readonly activeUsers = inject(ActiveUsersUseCase);
  private readonly inactiveUsers = inject(InactiveUsersUseCase);
  private readonly totalUsers = inject(TotalUsersUseCase);

  // State
  readonly selection = signal(new Set<string>());

  // Resources
  readonly users = resource({
    loader: () => firstValueFrom(this.findAllUsers.execute({})),
  });

  activeResource = resource({
    loader: () => firstValueFrom(this.activeUsers.execute({})),
  });

  totalResource = resource({
    loader: () => firstValueFrom(this.totalUsers.execute({})),
  });

  inactiveResources = resource({
    loader: () => firstValueFrom(this.inactiveUsers.execute({})),
  });

  // Computed Properties
  readonly selectedCount = computed(() => this.selection().size);

  // Simplificado: true si no hay exactamente 1 elemento
  readonly canEdit = computed(() => this.selectedCount() !== 1);

  // Methods
  navigate(): void {
    const selectedIds = Array.from(this.selection());

    if (selectedIds.length === 1) {
      this.router.navigate([
        '/configuraciones/usuarios/editar',
        selectedIds[0],
      ]);
    } else {
      this.router.navigate(['/configuraciones/usuarios/crear']);
    }
  }

  toggleSelection(id: string): void {
    this.selection.update((set) => {
      const next = new Set(set);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  selectAll(items: any[]): void {
    if (this.selectedCount() === items.length) {
      this.selection.set(new Set());
    } else {
      this.selection.set(new Set(items.map((u) => u.id)));
    }
  }

  isSelected(id: string): boolean {
    return this.selection().has(id);
  }
}
