import { Observable } from 'rxjs';
import { LoanModelDTO } from './loal.model';

export abstract class LoanRepository {
  abstract createLoan(loan: LoanModelDTO): Observable<string>;
}
