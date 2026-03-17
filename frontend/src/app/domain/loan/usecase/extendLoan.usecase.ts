import { inject, Injectable } from '@angular/core';
import { UseCase } from '@base/use-case';
import { Observable } from 'rxjs';
import { LoanRepository } from '../loan.repository';

@Injectable({
  providedIn: 'root',
})
export class ExtendLoanUseCase implements UseCase<
  { loan: string; comments: string; loanReturn: string },
  string
> {
  private repository = inject(LoanRepository);
  execute(params: {
    loan: string;
    comments: string;
    loanReturn: string;
  }): Observable<string> {
    return this.repository.extendLoan(
      params.loan,
      params.comments,
      params.loanReturn,
    );
  }
}
