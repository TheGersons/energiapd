import { Component, EventEmitter, inject, Output, signal } from '@angular/core';
import { Router } from '@angular/router';
import { LogoutUseCase } from '@domain/auth/usecase/logout.usecase';
import { Loader } from '@ui/icons/loader';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-navbar',
  imports: [Loader],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {
  @Output() toggleSidebar = new EventEmitter<void>();
  sidebar = signal<boolean>(false);

  logout = inject(LogoutUseCase);
  private router = inject(Router);

  onToggleSidebar() {
    this.sidebar.set(!this.sidebar());
    this.toggleSidebar.emit();
  }

  async onLogout() {
    const rs = await firstValueFrom(this.logout.execute());

    if (rs > 0) {
      this.router.navigate(['/iniciar-sesion']);
    }
  }
}
