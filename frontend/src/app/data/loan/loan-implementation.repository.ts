import { inject, Injectable } from '@angular/core';
import { LoanMapper } from './mapper/loan.mapper';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment.development';
import { map, Observable } from 'rxjs';
import { LoanRepository } from '@domain/loan/loan.repository';
import { LoanModelDTO } from '@domain/loan/loal.model';
import { LoanEntityDTO } from './loan.entity';

@Injectable({
  providedIn: 'root',
})
export class LoanImplementation extends LoanRepository {
  private loanMapper = new LoanMapper();
  private http = inject(HttpClient);
  private baseURL = `${environment.baseURL}loan/`;

  override createLoan(loan: LoanModelDTO): Observable<string> {
    return this.http.post<string>(`${this.baseURL}`, {
      loan: this.loanMapper.mapTo(loan),
    });
  }
}
