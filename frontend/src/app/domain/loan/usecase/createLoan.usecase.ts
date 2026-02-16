import { inject, Injectable } from '@angular/core';
import { UseCase } from '@base/use-case';
import { Observable } from 'rxjs';
import { LoanModelDTO } from '../loal.model';
import { LoanRepository } from '../loan.repository';

@Injectable({
  providedIn: 'root',
})
export class CreateLoanlUseCase implements UseCase<LoanModelDTO, string> {
  private loanRepository = inject(LoanRepository);

  execute(params: LoanModelDTO): Observable<string> {
    return this.loanRepository.createLoan(params);
  }
}
