import { inject, Injectable } from '@angular/core';
import { UseCase } from '@base/use-case';
import { LoanResponseModel } from '../loal.model';
import { Observable } from 'rxjs';
import { LoanRepository } from '../loan.repository';

@Injectable({
  providedIn: 'root',
})
export class FindOneLoanUseCase implements UseCase<string, LoanResponseModel> {
  private readonly repository = inject(LoanRepository);

  execute(params: string): Observable<LoanResponseModel> {
    return this.repository.findOneLoan(params);
  }
}
