import { Observable } from 'rxjs';
import { LoanModel } from './loal.model';

export abstract class LoanRepository {
  abstract findAllLoans(): Observable<LoanModel[]>;
  abstract findOneLoan(loan: Partial<LoanModel>): Observable<LoanModel>;
  abstract createLoan(loan: LoanModel): Observable<LoanModel>;
  abstract updateLoan(loan: LoanModel): Observable<number>;
}
