import { inject, Injectable } from '@angular/core';
import { LoanMapper } from './mapper/loan.mapper';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment.development';
import { map, Observable } from 'rxjs';
import { LoanRepository } from '@domain/loan/loan.repository';
import { LoanModelDTO, LoanResponseModel } from '@domain/loan/loal.model';
import { LoanResponseEntity } from './loan.entity';
import { LoansResponseMapper } from './mapper/loansResponse.mapper';
import { LoanResponseMapper } from './mapper/loanResponse.mapper';

@Injectable({
  providedIn: 'root',
})
export class LoanImplementation extends LoanRepository {
  private loanMapper = new LoanMapper();
  private loansResponseMapper = new LoansResponseMapper();
  private loanResponseMapper = new LoanResponseMapper();
  private http = inject(HttpClient);
  private baseURL = `${environment.baseURL}loan/`;

  override createLoan(loan: LoanModelDTO): Observable<string> {
    return this.http.post<string>(`${this.baseURL}`, {
      loan: this.loanMapper.mapTo(loan),
    });
  }

  override findAllLoans(): Observable<LoanResponseModel[]> {
    return this.http
      .get<LoanResponseEntity[]>(`${this.baseURL}`)
      .pipe(map(this.loansResponseMapper.mapFrom));
  }

  override findOneLoan(id: string): Observable<LoanResponseModel> {
    return this.http
      .get<LoanResponseEntity>(`${this.baseURL}one`, {
        params: { id },
      })
      .pipe(map(this.loanResponseMapper.mapFrom));
  }
}
