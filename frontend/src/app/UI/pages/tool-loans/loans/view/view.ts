import { CommonModule, Location } from '@angular/common';
import { Component, effect, inject, resource, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { LoanResponseModel } from '@domain/loan/loal.model';
import { FindOneLoanUseCase } from '@domain/loan/usecase/findOneLoan.usecase';
import { NgSelectModule } from '@ng-select/ng-select';
import { Loader } from '@ui/icons/loader';
import { ToastrService } from 'ngx-toastr';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-view',
  imports: [CommonModule, FormsModule, NgSelectModule, Loader],
  templateUrl: './view.html',
  styleUrl: './view.scss',
})
export class View {
  private readonly location = inject(Location);
  private readonly route = inject(ActivatedRoute);
  private readonly findOneLoan = inject(FindOneLoanUseCase);

  sTab = signal<'detail' | 'state' | 'actions'>('detail');

  createdAt = signal<string>('');
  loanName = signal<string>('');
  loanDepartment = signal<string>('');
  loanDni = signal<string>('');
  LoanUseDescription = signal<string>('');
  loanStatus = signal<string>('');
  loanNotes = signal<string>('');
  loanReturnDate = signal<string>('');

  loanResource = resource({
    params: () => this.route.snapshot.paramMap.get('id'),
    loader: async ({ params: id }) => {
      if (!id) return null;
      return await firstValueFrom(this.findOneLoan.execute(id));
    },
  });

  constructor() {
    effect(() => {
      const data = this.loanResource.value();

      if (data) {
        setTimeout(() => this.patchForm(data));
      }
    });
  }

  patchForm(data: LoanResponseModel) {
    this.createdAt.set(data.createdAt);
    this.loanName.set(data.loanName);
    this.loanDepartment.set(data.loanDepartment);
    this.LoanUseDescription.set(data.LoanUseDescription);
    this.loanStatus.set(data.loanStatus);
    this.loanNotes.set(data.loanNotes);
    this.loanReturnDate.set(data.loanReturnDate);
  }

  goBack(): void {
    this.location.back();
  }
}
