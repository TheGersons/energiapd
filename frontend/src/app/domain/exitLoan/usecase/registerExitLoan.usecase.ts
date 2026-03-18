import { inject, Injectable } from '@angular/core';
import { UseCase } from '@base/use-case';
import { ExitLoanModel } from '../exitLoan.model';
import { ExitLoanRepository } from '../exitLoan.reposotory';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RegisterExitLoanUseCase implements UseCase<string, ExitLoanModel> {
  private repository = inject(ExitLoanRepository);

  execute(params: string): Observable<ExitLoanModel> {
    return this.repository.registerExit(params);
  }
}
