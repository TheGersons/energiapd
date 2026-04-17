import { inject, Injectable } from '@angular/core';
import { LoanDtoMapper } from './mapper/loanDTO.mapper';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { map, Observable } from 'rxjs';
import { LoanRepository } from '@domain/loan/loan.repository';
import {
  LoanModelDTO,
  LoanModel,
  LoanResponseModel,
} from '@domain/loan/loal.model';
import { LoansMapper } from './mapper/loans.mapper';
import { LoanEntity, LoanResponseEntity } from './loan.entity';
import { LoanResponseMapper } from './mapper/loanResponse.mapper';

@Injectable({
  providedIn: 'root',
})
export class LoanImplementation extends LoanRepository {
  private loanDtoMapper = new LoanDtoMapper();
  private loansMapper = new LoansMapper();
  private loanResponseMapper = new LoanResponseMapper();
  private http = inject(HttpClient);
  private baseURL = `${environment.baseURL}loan/`;

  override createLoan(loan: LoanModelDTO): Observable<string> {
    return this.http.post<string>(`${this.baseURL}`, {
      loan: this.loanDtoMapper.mapTo(loan),
    });
  }

  override findAllLoans(): Observable<LoanModel[]> {
    return this.http
      .get<LoanEntity[]>(`${this.baseURL}`)
      .pipe(map(this.loansMapper.mapFrom));
  }

  override findOneLoan(id: string): Observable<LoanResponseModel> {
    return this.http
      .get<LoanResponseEntity>(`${this.baseURL}one`, {
        params: { id },
      })
      .pipe(map(this.loanResponseMapper.mapFrom));
  }

  override approveLoan(
    loan: string,
    status: boolean,
    state: string,
    comments: string,
    sign: string,
  ): Observable<string> {
    return this.http.patch<string>(`${this.baseURL}approval`, {
      idLoan: loan,
      approved: status,
      status: state,
      notes: comments,
      signature: sign,
    });
  }

  override deliverLoan(
    loan: string,
    status: boolean,
    state: string,
    comments: string,
    sign: string,
  ): Observable<string> {
    return this.http.patch<string>(`${this.baseURL}delivery`, {
      idLoan: loan,
      approved: status,
      status: state,
      notes: comments,
      signature: sign,
    });
  }

  override returnLoan(
    loan: string,
    status: boolean,
    state: string,
    comments: string,
    sign: string,
  ): Observable<string> {
    return this.http.patch<string>(`${this.baseURL}return`, {
      idLoan: loan,
      approved: status,
      status: state,
      notes: comments,
      signature: sign,
    });
  }

  override extendLoan(
    loan: string,
    comments: string,
    loanReturn: string,
    sign: string,
  ): Observable<string> {
    return this.http.patch<string>(`${this.baseURL}extend`, {
      idLoan: loan,
      notes: comments,
      returnDate: loanReturn,
      signature: sign,
    });
  }

  findOnePublicLoan(id: string): Observable<LoanResponseModel> {
    return this.http
      .get<LoanResponseEntity>(`${this.baseURL}pass`, {
        params: { id },
      })
      .pipe(map(this.loanResponseMapper.mapFrom));
  }
}
