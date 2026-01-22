import { NgClass } from '@angular/common';
import { Component, EventEmitter, Output, signal } from '@angular/core';

@Component({
  selector: 'app-navbar',
  imports: [NgClass],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {
  @Output() toggleSidebar = new EventEmitter<void>();
  sidebar = signal<boolean>(false);

  onToggleSidebar() {
    this.sidebar.set(!this.sidebar());
    this.toggleSidebar.emit();
  }
}
