import { Component, computed, inject, resource, signal } from '@angular/core';
import { Loader } from '@ui/icons/loader';
import { HasPermissionDirective } from '@base/directive/has-permission.directive';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { FindAllDepartmentsUseCase } from '@domain/department/usecase/findAllDepartments.usecase';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  imports: [Loader, HasPermissionDirective, DatePipe],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  selection = signal(new Set<string>());
  canEdit = computed(() => this.selection().size === 1);

  findAllDepartments = inject(FindAllDepartmentsUseCase);


  DepartmentsResource = resource({
    loader: () => firstValueFrom(this.findAllDepartments.execute()),
  });

  navigate(type: number) {
    if (type === 2) {
      const id = Array.from(this.selection())[0];
      this.router.navigate(['/configuraciones/departamentos/editar', id]);
      return;
    }
    this.router.navigate(['/configuraciones/departamentos/crear']);
  }

  onSelectRow(id: string) {
    this.selection.update((a) => {
      const b = new Set(a);
      b.has(id) ? b.delete(id) : b.add(id);
      return b;
    });
  }
}
