import {
  Directive,
  Input,
  TemplateRef,
  ViewContainerRef,
  inject,
  effect,
} from '@angular/core';
import { PermissionsService } from '@base/service/permission.service';

@Directive({
  selector: '[hasPermission]',
  standalone: true,
})
export class HasPermissionDirective {
  private templateRef = inject(TemplateRef<any>);
  private viewContainer = inject(ViewContainerRef);
  private permissions = inject(PermissionsService);

  @Input() set hasPermission(slugs: string | string[]) {
    const required = Array.isArray(slugs) ? slugs : [slugs];

    if (this.permissions.hasAny(required)) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }
}
