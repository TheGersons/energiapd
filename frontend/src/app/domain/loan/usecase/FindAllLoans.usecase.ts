import { inject, Injectable } from '@angular/core';
import { UseCase } from '@base/use-case';
import { LoanModel } from '../loal.model';
import { LoanRepository } from '../loan.repository';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FindAllLoansUseCase implements UseCase<void, LoanModel[]> {
  private repository = inject(LoanRepository);

  execute(params: void): Observable<LoanModel[]> {
    return this.repository.findAllLoans();
  }
}
