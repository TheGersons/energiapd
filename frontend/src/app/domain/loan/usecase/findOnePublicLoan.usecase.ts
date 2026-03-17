import { inject, Injectable } from '@angular/core';
import { UseCase } from '@base/use-case';
import { LoanResponseModel } from '../loal.model';
import { LoanRepository } from '../loan.repository';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FindOnePublicLoan implements UseCase<string, LoanResponseModel> {
  private repository = inject(LoanRepository);

  execute(params: string): Observable<LoanResponseModel> {
    return this.repository.findOnePublicLoan(params);
  }
}
