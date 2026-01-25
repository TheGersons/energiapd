import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import {
  provideClientHydration,
  withEventReplay,
  withIncrementalHydration,
} from '@angular/platform-browser';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { PermissionRepository } from '@domain/permission/permission.repository';
import { PermissionImplementation } from '@data/permission/permission-implementation.repository';
import { RoleRepository } from '@domain/role/role.repository';
import { RoleImplementation } from '@data/role/role-implementation.repository';
import { provideToastr } from 'ngx-toastr';
import { ModuleRepository } from '@domain/module/module.repository';
import { ModuleImplementation } from '@data/module/module-implementation.repository';
import { NavigationStateRepository } from '@domain/navigation/navigation-state.repository';
import { NavigationStateImplementation } from '@data/navigation/navigation-state-implementation.repository';
import { ToolRepository } from '@domain/tool/tool.repository';
import { ToolImplementation } from '@data/tool/tool-implementation.repository';
import { LoanRepository } from '@domain/loan/loan.repository';
import { LoanImplementation } from '@data/loan/loan-implementation.repository';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideClientHydration(withEventReplay(), withIncrementalHydration()),
    provideHttpClient(withFetch()),
    provideAnimations(),
    provideToastr(),
    { provide: PermissionRepository, useClass: PermissionImplementation },
    { provide: RoleRepository, useClass: RoleImplementation },
    { provide: ModuleRepository, useClass: ModuleImplementation },
    {
      provide: NavigationStateRepository,
      useClass: NavigationStateImplementation,
    },
    {
      provide: ToolRepository,
      useClass: ToolImplementation,
    },
    {
      provide: LoanRepository,
      useClass: LoanImplementation,
    },
  ],
};
