import { inject, Injectable } from '@angular/core';
import { UseCase } from '@base/use-case';
import { Observable } from 'rxjs';
import { LoanModel } from '../loal.model';
import { LoanRepository } from '../loan.repository';

@Injectable({
  providedIn: 'root',
})
export class CreateLoanlUseCase implements UseCase<LoanModel, LoanModel> {
  private loanRepository = inject(LoanRepository);

  execute(params: LoanModel): Observable<LoanModel> {
    return this.loanRepository.createLoan(params);
  }
}
