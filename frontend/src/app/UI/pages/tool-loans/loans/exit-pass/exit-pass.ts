import { Component, inject, resource, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoanResponseModel } from '@domain/loan/loal.model';
import { FindOnePublicLoan } from '@domain/loan/usecase/findOnePublicLoan.usecase';
import { environment } from 'environments/environment.development';
import { firstValueFrom } from 'rxjs';
import { DatePipe, NgClass } from '@angular/common';

@Component({
  selector: 'app-exit-pass',
  imports: [DatePipe, NgClass],
  templateUrl: './exit-pass.html',
  styleUrl: './exit-pass.scss',
})
export class ExitPass {
  private readonly route = inject(ActivatedRoute);
  private readonly findOneLoan = inject(FindOnePublicLoan);

  loanId = signal<string>('');
  loan = signal<LoanResponseModel | null>(null);
  isLoading = signal(true);
  hasError = signal(false);

  /** URL que se codifica en el QR para re-escanear al entrar */
  get qrUrl(): string {
    return `${environment.host}pase-salida/${this.loanResource.value()?.loanId}`;
  }

  loanResource = resource({
    params: () => this.route.snapshot.paramMap.get('id'),
    loader: async ({ params: id }) => {
      if (!id) return null;
      this.isLoading.set(false);
      return await firstValueFrom(this.findOneLoan.execute(id));
    },
  });

  /** Color de la banda superior según estado */
  get statusBand(): string {
    const map: Record<string, string> = {
      Entregado: 'from-emerald-400 to-emerald-500',
      Aprobado: 'from-blue-400 to-blue-600',
      Devuelto: 'from-slate-300 to-slate-400',
      Denegado: 'from-red-400 to-red-500',
    };
    return map[this.loan()?.loanStatus ?? ''] ?? map['Aprobado'];
  }

  get statusLabel(): string {
    const map: Record<string, string> = {
      Entregado: 'ACTIVO',
      Aprobado: 'APROBADO',
      Devuelto: 'DEVUELTO',
      Denegado: 'DENEGADO',
    };
    return map[this.loan()?.loanStatus ?? ''] ?? '';
  }

  get statusBadge(): string {
    const map: Record<string, string> = {
      Entregado: 'bg-emerald-50 border-emerald-200 text-emerald-700',
      Aprobado: 'bg-blue-50 border-blue-200 text-blue-700',
      Devuelto: 'bg-slate-100 border-slate-200 text-slate-500',
      Denegado: 'bg-red-50 border-red-200 text-red-700',
    };
    return map[this.loan()?.loanStatus ?? ''] ?? map['Aprobado'];
  }

  get dotColor(): string {
    const map: Record<string, string> = {
      Entregado: 'bg-emerald-500',
      Aprobado: 'bg-blue-500',
      Devuelto: 'bg-slate-400',
      Denegado: 'bg-red-500',
    };
    return map[this.loan()?.loanStatus ?? ''] ?? 'bg-blue-500';
  }
}
