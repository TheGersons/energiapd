import { inject, Injectable } from '@angular/core';
import { UseCase } from '@base/use-case';
import { Observable } from 'rxjs';
import { LoanRepository } from '../loan.repository';

@Injectable({
  providedIn: 'root',
})
export class DeliverLoanUseCase implements UseCase<
  { loan: string; status: boolean; state: string; comments: string, sign: string },
  string
> {
  private repository = inject(LoanRepository);

  execute(params: {
    loan: string;
    status: boolean;
    state: string;
    comments: string;
    sign: string
  }): Observable<string> {
    return this.repository.deliverLoan(
      params.loan,
      params.status,
      params.state,
      params.comments,
      params.sign
    );
  }
}
