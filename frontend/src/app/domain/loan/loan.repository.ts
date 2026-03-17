import { Observable } from 'rxjs';
import { LoanModelDTO, LoanModel, LoanResponseModel } from './loal.model';

export abstract class LoanRepository {
  abstract createLoan(loan: LoanModelDTO): Observable<string>;
  abstract findAllLoans(): Observable<LoanModel[]>;
  abstract findOneLoan(id: string): Observable<LoanResponseModel>;
  abstract approveLoan(
    loan: string,
    status: boolean,
    state: string,
    comments: string,
  ): Observable<string>;
}
