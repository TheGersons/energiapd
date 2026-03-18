import { Observable } from 'rxjs';
import { ExitLoanModel } from './exitLoan.model';

export abstract class ExitLoanRepository {
  abstract findExitByLoan(loanId: string): Observable<ExitLoanModel[]>;
  abstract registerExit(loanId: string): Observable<ExitLoanModel>;
}
