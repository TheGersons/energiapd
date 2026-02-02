import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Loader } from '@ui/icons/loader';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-dashboard',
  imports: [Loader],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  selection = signal(new Set<string>());

  private toastr = inject(ToastrService);

  private router = inject(Router);

  navigate() {
    let id;
    if (this.selection().size === 1) {
      id = Array.from(this.selection())[0];
      this.router.navigate(['/configuraciones/usuarios/editar', id]);
      return;
    }
    this.router.navigate(['/configuraciones/usuarios/crear']);
  }
}
