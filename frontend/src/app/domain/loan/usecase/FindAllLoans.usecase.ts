import { inject, Injectable } from '@angular/core';
import { UseCase } from '@base/use-case';
import { LoanResponseEntity } from '@data/loan/loan.entity';
import { LoanResponseModel } from '../loal.model';
import { LoanRepository } from '../loan.repository';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FindAllLoansUseCase implements UseCase<void, LoanResponseModel[]> {
  private repository = inject(LoanRepository);

  execute(params: void): Observable<LoanResponseModel[]> {
    return this.repository.findAllLoans();
  }
}
