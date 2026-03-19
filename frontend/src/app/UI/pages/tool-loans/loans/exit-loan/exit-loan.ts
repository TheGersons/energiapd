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
import { Loader } from '@ui/icons/loader';

type ApproveType = 'approval' | 'delivery' | 'return' | 'extension';
type LoanStatus = 'Entregado' | 'Aprobado' | 'Devuelto' | 'Denegado';
type LogType = 'salida' | 'ingreso';

interface ApproveConfig {
  label: string;
  iconPath: string;
  wrapperClass: (state: boolean) => string;
  iconClass: (state: boolean) => string;
  badgeClass: (state: boolean) => string;
  badgeLabel: (state: boolean) => string;
}

interface StatusConfig {
  band: string;
  label: string;
  badge: string;
  dot: string;
}

interface LogConfig {
  wrapper: string;
  icon: string;
  iconName: string;
  titleClass: string;
  eventTitle: string;
  eventLabel: string;
}

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

  // ── Estado ───────────────────────────────────────────────────
  loanId = signal<string>('');
  loan = signal<LoanResponseModel | null>(null);
  currentLog = signal<ExitLoanModel | null>(null);
  history = signal<ExitLoanModel[]>([]);
  isLoading = signal(true);
  hasError = signal(false);
  errorMsg = signal('');

  // ── Mapa de configuración por estado del préstamo ────────────
  readonly statusConfig: Record<string, StatusConfig> = {
    Entregado: {
      band: 'from-blue-400 to-blue-600',
      label: 'En préstamo',
      badge: 'bg-blue-50 border border-blue-200 text-blue-700',
      dot: 'bg-blue-500',
    },
    Aprobado: {
      band: 'from-amber-300 to-amber-500',
      label: 'Aprobado',
      badge: 'bg-amber-50 border border-amber-200 text-amber-700',
      dot: 'bg-amber-500',
    },
    Devuelto: {
      band: 'from-gray-300 to-gray-400',
      label: 'Devuelto',
      badge: 'bg-gray-100 border border-gray-200 text-gray-500',
      dot: 'bg-gray-400',
    },
    Denegado: {
      band: 'from-red-400 to-red-500',
      label: 'Denegado',
      badge: 'bg-red-50 border border-red-200 text-red-700',
      dot: 'bg-red-500',
    },
  };

  // ── Mapa de configuración por tipo de aprobación ─────────────
  readonly approveConfig: Record<ApproveType, ApproveConfig> = {
    approval: {
      label: 'Aprobación de solicitud',
      iconPath:
        'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
      wrapperClass: (s) =>
        s
          ? 'bg-green-50 border border-green-200'
          : 'bg-red-50 border border-red-200',
      iconClass: (s) => (s ? 'text-green-600' : 'text-red-500'),
      badgeClass: (s) =>
        s ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700',
      badgeLabel: (s) => (s ? 'Autorizado' : 'Denegado'),
    },
    delivery: {
      label: 'Entrega de herramientas',
      iconPath:
        'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4',
      wrapperClass: (s) =>
        s
          ? 'bg-green-50 border border-green-200'
          : 'bg-red-50 border border-red-200',
      iconClass: (s) => (s ? 'text-green-600' : 'text-red-500'),
      badgeClass: (s) =>
        s ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700',
      badgeLabel: (s) => (s ? 'Completada' : 'Denegada'),
    },
    return: {
      label: 'Devolución a almacén',
      iconPath: 'M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6',
      wrapperClass: (_) => 'bg-gray-50 border border-gray-200',
      iconClass: (_) => 'text-gray-500',
      badgeClass: (_) => 'bg-gray-100 text-gray-600',
      badgeLabel: (_) => 'Completada',
    },
    extension: {
      label: 'Extensión de plazo',
      iconPath: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
      wrapperClass: (_) => 'bg-amber-50 border border-amber-200',
      iconClass: (_) => 'text-amber-600',
      badgeClass: (_) => 'bg-amber-100 text-amber-700',
      badgeLabel: (_) => 'Aplicada',
    },
  };

  // ── Mapa de configuración por tipo de movimiento de garita ───
  readonly logConfig: Record<LogType, LogConfig> = {
    salida: {
      wrapper: 'bg-orange-50 border border-orange-200',
      icon: 'text-orange-500',
      iconName: 'arrow-left',
      eventTitle: 'Salida de instalaciones',
      titleClass: 'text-orange-500',
      eventLabel: 'Salida registrada',
    },
    ingreso: {
      wrapper: 'bg-green-50 border border-green-200 ',
      icon: 'text-green-600 rotate-180',
      iconName: 'arrow-left',
      eventTitle: 'Ingreso a instalaciones',
      titleClass: 'text-green-600',
      eventLabel: 'Ingreso registrado',
    },
  };

  // ── Accesores de conveniencia para el template ───────────────
  get currentStatus(): StatusConfig {
    return (
      this.statusConfig[this.loan()?.loanStatus ?? ''] ??
      this.statusConfig['Devuelto']
    );
  }

  get currentLogConfig(): LogConfig {
    const type = (this.currentLog()?.exitPassType ?? 'salida') as LogType;
    return this.logConfig[type];
  }

  getApproveConfig(type: string): ApproveConfig {
    return (
      this.approveConfig[type as ApproveType] ?? this.approveConfig['approval']
    );
  }

  getLogConfig(type: string): LogConfig {
    return this.logConfig[type as LogType];
  }

  // ── Ciclo de vida ────────────────────────────────────────────
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
}
