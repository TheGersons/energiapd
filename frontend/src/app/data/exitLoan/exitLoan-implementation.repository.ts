import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ExitLoanModel } from '@domain/exitLoan/exitLoan.model';
import { ExitLoanRepository } from '@domain/exitLoan/exitLoan.reposotory';
import { map, Observable } from 'rxjs';
import { ExitLoanEntity } from './exitPass.entity';
import { environment } from 'environments/environment';
import { ExitLoansMapper } from './mapper/exitLoans.mapper';
import { ExitLoanMapper } from './mapper/exitLoan.mapper';

@Injectable({
  providedIn: 'root',
})
export class ExitLoanImplementation extends ExitLoanRepository {
  private http = inject(HttpClient);
  private exitLoansMapper = new ExitLoansMapper();
  private exitLoanMapper = new ExitLoanMapper();
  private baseURL = `${environment.baseURL}exitLoan/`;

  override findExitByLoan(loanId: string): Observable<ExitLoanModel[]> {
    return this.http
      .get<ExitLoanEntity[]>(this.baseURL, {
        params: { idLoan: loanId },
      })
      .pipe(map(this.exitLoansMapper.mapFrom));
  }

  override registerExit(loanId: string): Observable<ExitLoanModel> {
    return this.http
      .post<ExitLoanEntity>(this.baseURL, {
        idLoan: loanId,
      })
      .pipe(map(this.exitLoanMapper.mapFrom));
  }
}
