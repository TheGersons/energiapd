import {
  Directive,
  inject,
  Input,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { PermissionsService } from '@base/service/permission.service';

@Directive({
  selector: '[hasNoPermission]',
})
export class HasNoPermissionDirective {
  private templateRef = inject(TemplateRef<any>);
  private viewContainer = inject(ViewContainerRef);
  private permissions = inject(PermissionsService);

  @Input() set hasNoPermission(slugs: string | string[]) {
    const required = Array.isArray(slugs) ? slugs : [slugs];

    if (!this.permissions.hasAny(required)) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }
}
