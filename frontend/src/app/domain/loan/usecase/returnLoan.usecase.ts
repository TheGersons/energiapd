import { inject, Injectable } from '@angular/core';
import { LoanRepository } from '../loan.repository';
import { UseCase } from '@base/use-case';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ReturnLoanUseCase implements UseCase<
  { loan: string; status: boolean; state: string; comments: string },
  string
> {
  private repository = inject(LoanRepository);

  execute(params: {
    loan: string;
    status: boolean;
    state: string;
    comments: string;
  }): Observable<string> {
    return this.repository.returnLoan(
      params.loan,
      params.status,
      params.state,
      params.comments,
    );
  }
}
