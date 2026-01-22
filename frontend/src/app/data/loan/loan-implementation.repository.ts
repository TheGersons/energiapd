import { inject, Injectable } from '@angular/core';
import { ToolRepository } from '@domain/tool/tool.repository';
import { LoanMapper } from './mapper/loan.mapper';
import { LoansMapper } from './mapper/loans.mapper';
import { PartialLoanMapper } from './mapper/partial-loan.mapper';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment.development';
import { map, Observable } from 'rxjs';
import { LoanModel } from '@domain/loan/loal.model';
import { LoanRepository } from '@domain/loan/loan.repository';
import { LoanEntity } from './loan.entity';

@Injectable({
  providedIn: 'root',
})
export class LoanImplementation extends LoanRepository {
  private loanMapper = new LoanMapper();
  private loansMapper = new LoansMapper();
  private partialLoanMapper = new PartialLoanMapper();
  private http = inject(HttpClient);
  private baseURL = `${environment.baseURL}loan/`;

  override createLoan(loan: LoanModel): Observable<LoanModel> {
    return this.http
      .post<LoanEntity>(`${this.baseURL}loan`, {
        loan: this.loanMapper.mapTo(loan),
      })
      .pipe(map(this.loanMapper.mapFrom));
  }

  override findAllLoans(): Observable<LoanModel[]> {
    return this.http
      .get<LoanEntity[]>(`${this.baseURL}loans`)
      .pipe(map(this.loansMapper.mapFrom));
  }

  override findOneLoan(loan: Partial<LoanModel>): Observable<LoanModel> {
    return this.http
      .get<LoanEntity>(`${this.baseURL}loan`, {
        params: this.partialLoanMapper.mapTo(loan),
      })
      .pipe(map(this.loanMapper.mapFrom));
  }

  override updateLoan(loan: LoanModel): Observable<number> {
    return this.http.put<number>(`${this.baseURL}loans`, {
      loan: this.loanMapper.mapTo,
    });
  }
}
