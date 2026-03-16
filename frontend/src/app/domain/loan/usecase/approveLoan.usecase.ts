import { inject, Injectable } from '@angular/core';
import { UseCase } from '@base/use-case';
import { LoanRepository } from '../loan.repository';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApproveLoanUseCase implements UseCase<
  { loan: string; status: boolean; state: string },
  string
> {
  private repository = inject(LoanRepository);

  execute(params: { loan: string; status: boolean, state: string }): Observable<string> {
    return this.repository.approveLoan(params.loan, params.status, params.state);
  }
}
