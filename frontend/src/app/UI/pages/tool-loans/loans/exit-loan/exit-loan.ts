import {
  AfterViewInit,
  Component,
  inject,
  resource,
  signal,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoanResponseModel } from '@domain/loan/loal.model';
import { FindOnePublicLoan } from '@domain/loan/usecase/findOnePublicLoan.usecase';
import { firstValueFrom } from 'rxjs';
import { DatePipe, NgClass } from '@angular/common';
import { ExitLoanModel } from '@domain/exitLoan/exitLoan.model';
import { RegisterExitLoanUseCase } from '@domain/exitLoan/usecase/registerExitLoan.usecase';
import { FindByLoanUseCase } from '@domain/exitLoan/usecase/findByLoan.usecase';
import { Loader } from "@ui/icons/loader";

@Component({
  selector: 'app-exit-pass',
  imports: [DatePipe, NgClass, Loader],
  templateUrl: './exit-loan.html',
  styleUrl: './exit-loan.scss',
})
export class ExitLoan {
  private readonly route = inject(ActivatedRoute);
  private readonly findOneLoan = inject(FindOnePublicLoan);
  private readonly registerVehicleLog = inject(RegisterExitLoanUseCase);
  private readonly findVehicleLogs = inject(FindByLoanUseCase);

  loanId = signal<string>('');
  loan = signal<LoanResponseModel | null>(null);
  currentLog = signal<ExitLoanModel | null>(null);
  history = signal<ExitLoanModel[]>([]);
  isLoading = signal(true);
  hasError = signal(false);
  errorMsg = signal('');

  async ngOnInit() {
    const id = this.route.snapshot.params['id'];
    this.loanId.set(id);

    try {
      const [loan, log] = await Promise.all([
        firstValueFrom(this.findOneLoan.execute(id)),
        firstValueFrom(this.registerVehicleLog.execute(id)),
      ]);

      this.loan.set(loan);
      this.currentLog.set(log);

      const logs = await firstValueFrom(this.findVehicleLogs.execute(id));
      this.history.set(logs);
    } catch (err: any) {
      this.hasError.set(true);
      this.errorMsg.set(err?.error?.message ?? 'No se pudo cargar el pase.');
    } finally {
      this.isLoading.set(false);
    }
  }

  get isSalida(): boolean {
    return this.currentLog()?.exitPassType === 'salida';
  }

  get statusBand(): string {
    const map: Record<string, string> = {
      Entregado: 'from-blue-400 to-blue-600',
      Aprobado: 'from-amber-300 to-amber-500',
      Devuelto: 'from-gray-300 to-gray-400',
      Denegado: 'from-red-400 to-red-500',
    };
    return map[this.loan()?.loanStatus ?? ''] ?? 'from-gray-200 to-gray-300';
  }

  get statusLabel(): string {
    const map: Record<string, string> = {
      Entregado: 'En préstamo',
      Aprobado: 'Aprobado',
      Devuelto: 'Devuelto',
      Denegado: 'Denegado',
    };
    return map[this.loan()?.loanStatus ?? ''] ?? this.loan()?.loanStatus ?? '';
  }

  get statusBadge(): string {
    const map: Record<string, string> = {
      Entregado: 'bg-blue-50 border border-blue-200 text-blue-700',
      Aprobado: 'bg-amber-50 border border-amber-200 text-amber-700',
      Devuelto: 'bg-gray-100 border border-gray-200 text-gray-500',
      Denegado: 'bg-red-50 border border-red-200 text-red-700',
    };
    return (
      map[this.loan()?.loanStatus ?? ''] ??
      'bg-gray-100 border border-gray-200 text-gray-500'
    );
  }

  get dotColor(): string {
    const map: Record<string, string> = {
      Entregado: 'bg-blue-500',
      Aprobado: 'bg-amber-500',
      Devuelto: 'bg-gray-400',
      Denegado: 'bg-red-500',
    };
    return map[this.loan()?.loanStatus ?? ''] ?? 'bg-gray-400';
  }
}
