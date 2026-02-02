import { Location } from '@angular/common';
import { Component, inject, resource, signal } from '@angular/core';
import { FindAllRolesUseCase } from '@domain/role/usecase/findAllRoles.usecase';
import { NgSelectModule } from '@ng-select/ng-select';
import { Loader } from '@ui/icons/loader';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-create',
  imports: [NgSelectModule, Loader],
  templateUrl: './create.html',
  styleUrl: './create.scss',
})
export class Create {
  private location = inject(Location);

  private findAllRoles = inject(FindAllRolesUseCase);

  sRole = signal(new Set<string>());

  userDisplayName = signal<string>('');
  username= signal<string>('');
  userMail = signal<string>('');
  userPass = signal<string>('');
  
  

  roles = resource({
    loader: () => firstValueFrom(this.findAllRoles.execute({})),
  });

  goBack(): void {
    this.location.back();
  }
}
