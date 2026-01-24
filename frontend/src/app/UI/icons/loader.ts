import {
  Attribute,
  Component,
  inject,
  Input,
  signal,
  Type,
} from '@angular/core';
import { IconRegistry } from './icon-registry';
import { NgComponentOutlet } from '@angular/common';

@Component({
  selector: 'app-loader',
  imports: [NgComponentOutlet],
  template: `
    @if (iconComponent()) {
      <ng-container>
        <ng-container
          *ngComponentOutlet="iconComponent(); inputs: { class: hostClass }"
        ></ng-container>
      </ng-container>
    }
  `,
  styles: ``,
})
export class Loader {
  private iconRegistry = inject(IconRegistry);
  iconComponent = signal<Type<any> | null>(null);
  constructor(@Attribute('class') public hostClass: string) {}
  @Input({ required: true })
  set name(value: string) {
    const loader = this.iconRegistry.getIconLoader(value);

    loader().then((componentType) => {
      this.iconComponent.set(componentType);
    });
  }
}
