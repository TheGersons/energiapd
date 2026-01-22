import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from '../navbar/navbar';
import { NgClass } from '@angular/common';
import { Aside } from "../aside/aside";

@Component({
  selector: 'app-main',
  imports: [RouterOutlet, Navbar, NgClass, Aside],
  templateUrl: './main.html',
  styleUrl: './main.scss',
})
export class Main {
  toggleSidebar = signal<boolean>(false);

  onToggleSidebar() {
    this.toggleSidebar.set(!this.toggleSidebar());
  }
}
