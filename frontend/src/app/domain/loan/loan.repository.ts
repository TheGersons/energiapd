import { Observable } from 'rxjs';
import { LoanModelDTO, LoanResponseModel } from './loal.model';

export abstract class LoanRepository {
  abstract createLoan(loan: LoanModelDTO): Observable<string>;
  abstract findAllLoans(): Observable<LoanResponseModel[]>;
  abstract findOneLoan(id: string): Observable<LoanResponseModel>;
}
