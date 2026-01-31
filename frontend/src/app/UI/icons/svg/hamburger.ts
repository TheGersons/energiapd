import { NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-hamburger',
  imports: [NgClass],
  template: `
    <svg
      [ngClass]="hostClass"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      class="overflow-visible"
    >
      <path d="M4 6h16" class="line top" />

      <path d="M4 12h16" class="line middle" />

      <path d="M4 18h16" class="line bottom" />
    </svg>
  `,
  styles: ``,
})
export class Hamburger {
  @Input() hostClass: string = '';
}
