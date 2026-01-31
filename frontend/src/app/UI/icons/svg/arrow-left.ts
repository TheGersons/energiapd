import { Component, Input } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-arrow-left',
  imports: [NgClass],
  template: `
    <svg
      [ngClass]="hostClass"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M15 19l-7-7 7-7"
      ></path>
    </svg>
  `,
  styles: ``,
})
export class ArrowLeft {
  @Input() hostClass: string = '';
}
