import { NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-epd',
  imports: [NgClass],
  template: `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      [ngClass]="hostClass"
      id="Capa_1"
      version="1.1"
      viewBox="0 0 64 64"
    >
      <defs>
        <style>
          .st0 {
            fill: #921915;
          }

          .st1 {
            fill: #1177b7;
          }

          .st2 {
            fill: #14559c;
          }

          .st3 {
            fill: #a11e1f;
          }

          .st4 {
            fill: #bd484a;
          }

          .st5 {
            fill: #259dd7;
          }
        </style>
      </defs>
      <path
        class="st0"
        d="M34.5,0l15.8,16-10.9,11-10.7-10.7c-2.9-2.9-3-7.6,0-10.6l5.8-5.7Z"
      />
      <path
        class="st4"
        d="M39.4,27l15.8,16-10.9,11-10.7-10.7c-2.9-2.9-3-7.6,0-10.6l5.8-5.7Z"
      />
      <path
        class="st3"
        d="M55.3,43l-15.8-16,10.9-10.9,10.7,10.7c2.9,2.9,2.9,7.6,0,10.6l-5.8,5.7Z"
      />
      <g>
        <path
          class="st2"
          d="M29.5,64l-15.8-16,10.9-11,10.7,10.7c2.9,2.9,3,7.6,0,10.6l-5.8,5.7Z"
        />
        <path
          class="st5"
          d="M24.6,37l-15.8-16,10.9-11,10.7,10.7c2.9,2.9,3,7.6,0,10.6l-5.8,5.7Z"
        />
        <path
          class="st1"
          d="M8.7,21l15.8,16-10.9,10.9-10.7-10.7C0,34.4,0,29.6,2.9,26.7l5.8-5.7Z"
        />
      </g>
    </svg>
  `,
  styles: ``,
})
export class Epd {
  @Input() hostClass: string = '';
}
