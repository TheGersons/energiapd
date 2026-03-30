import { CommonModule, DatePipe, Location } from '@angular/common';
import {
  AfterViewInit,
  Component,
  computed,
  effect,
  inject,
  OnInit,
  resource,
  signal,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { LoanModel, LoanResponseModel } from '@domain/loan/loal.model';
import { FindOneLoanUseCase } from '@domain/loan/usecase/findOneLoan.usecase';
import { NgSelectModule } from '@ng-select/ng-select';
import { Loader } from '@ui/icons/loader';
import { ToastrService } from 'ngx-toastr';
import { firstValueFrom } from 'rxjs';
import { HasPermissionDirective } from '@base/directive/has-permission.directive';
import { HasNoPermissionDirective } from '@base/directive/has-no-permission';
import { QRCodeComponent } from 'angularx-qrcode';
import { v4 as uuidv4, validate } from 'uuid';
import { SignatureSocket } from '@base/socket/signature.socket';
import {
  NgSignaturePadOptions,
  SignaturePadComponent,
} from '@almothafar/angular-signature-pad';
import { environment } from 'environments/environment.development';
import { ApproveLoanUseCase } from '@domain/loan/usecase/approveLoan.usecase';
import { ToolModel } from '@domain/tool/tool.model';
import { DeliverLoanUseCase } from '@domain/loan/usecase/deliverLoan.usecase';
import { ReturnLoanUseCase } from '@domain/loan/usecase/returnLoan.usecase';
import { ExtendLoanUseCase } from '@domain/loan/usecase/extendLoan.usecase';

export type signatureType = 'delivery' | 'return' | 'approval' | 'extend';

@Component({
  selector: 'app-view',
  imports: [
    CommonModule,
    FormsModule,
    NgSelectModule,
    Loader,
    HasPermissionDirective,
    HasNoPermissionDirective,
    QRCodeComponent,
    SignaturePadComponent,
    DatePipe,
  ],
  templateUrl: './view.html',
  styleUrl: './view.scss',
})
export class View implements OnInit, AfterViewInit {
  @ViewChild('signaturePad') public signaturePad!: SignaturePadComponent;
  @ViewChild('deliverySignaturePad')
  public deliverySignaturePad!: SignaturePadComponent;
  @ViewChild('returnSignaturePad')
  public returnSignaturePad!: SignaturePadComponent;

  public signaturePadOptions: NgSignaturePadOptions = {
    maxWidth: 0.5,
    velocityFilterWeight: 0.7,
    canvasWidth: 300,
    canvasHeight: 200,
  };

  private readonly location = inject(Location);
  private readonly route = inject(ActivatedRoute);
  private readonly findOneLoan = inject(FindOneLoanUseCase);
  private readonly signatureSocket = inject(SignatureSocket);
  private readonly approveLoan = inject(ApproveLoanUseCase);
  private readonly deliverLoan = inject(DeliverLoanUseCase);
  private readonly returnLoan = inject(ReturnLoanUseCase);
  private readonly extendLoan = inject(ExtendLoanUseCase);
  private readonly toastr = inject(ToastrService);

  private readonly sessionId = uuidv4();
  private readonly deliverySessionId = uuidv4();
  private readonly returnSessionId = uuidv4();
  private readonly extendSessionId = uuidv4();

  readonly url = `${environment.host}firma-herramientas/${this.sessionId}/approval`;
  readonly deliveryUrl = `${environment.host}firma-herramientas/${this.deliverySessionId}/delivery`;
  readonly returnUrl = `${environment.host}firma-herramientas/${this.returnSessionId}/return`;
  readonly extendUrl = `${environment.host}firma-herramientas/${this.extendSessionId}/extension`;

  sTab = signal<'detail' | 'state' | 'actions'>('detail');

  signatureActions: Record<string, (val: string) => void> = {
    delivery: (val) => this.deliverySignatureImage.set(val),
    return: (val) => this.returnSignatureImage.set(val),
    approval: (val) => this.signatureImage.set(val),
    extend: (val) => this.extendSignatureImage.set(val),
  };

  createdAt = signal<string>('');
  loanName = signal<string>('');
  loanDepartment = signal<string>('');
  loanDni = signal<string>('');
  LoanUseDescription = signal<string>('');
  loanStatus = signal<string>('');
  loanNotes = signal<string>('');
  loanReturnDate = signal<string>('');
  loanTools = signal<ToolModel[]>([]);

  signatureImage = signal<string>('');
  showPcPad = signal<boolean>(false);

  deliverySignatureImage = signal<string>('');
  showDeliveryPcPad = signal<boolean>(false);
  deliveryNotes = signal<string>('');
  verifiedTools = signal<Set<string>>(new Set());

  verifiedCount = computed(() => this.verifiedTools().size);
  allToolsVerified = computed(
    () =>
      this.loanTools().length > 0 &&
      this.verifiedTools().size === this.loanTools().length,
  );
  canConfirmDelivery = computed(
    () => this.allToolsVerified() && this.deliverySignatureImage().length > 0,
  );
  passUrl = computed(
    () =>
      `${environment.host}pase-salida/${this.loanResource.value()?.loanId ?? ''}`,
  );

  returnSignatureImage = signal<string>('');
  showReturnPcPad = signal<boolean>(false);
  returnNotes = signal<string>('');
  extendSignatureImage = signal<string>('');
  showExtendPcPad = signal<boolean>(false);
  returnVerifiedTools = signal<Set<string>>(new Set());

  returnVerifiedCount = computed(() => this.returnVerifiedTools().size);
  allReturnToolsVerified = computed(
    () =>
      this.loanTools().length > 0 &&
      this.returnVerifiedTools().size === this.loanTools().length,
  );
  canConfirmReturn = computed(
    () =>
      this.allReturnToolsVerified() && this.returnSignatureImage().length > 0,
  );

  canConfirmExtend = computed(
    () =>
      this.extendReturnDate().length > 0 &&
      this.extendSignatureImage().length > 0,
  );

  readonly approvalEntry = computed(() =>
    this.loanResource
      .value()
      ?.approves?.find((a) => a.approveType === 'approval'),
  );

  readonly deliveryEntry = computed(() =>
    this.loanResource
      .value()
      ?.approves?.find((a) => a.approveType === 'delivery'),
  );

  readonly returnEntry = computed(() =>
    this.loanResource
      .value()
      ?.approves?.find((a) => a.approveType === 'return'),
  );

  selectAllDelivery(): void {
    if (this.allToolsVerified()) {
      this.verifiedTools.set(new Set());
    } else {
      this.verifiedTools.set(
        new Set(this.loanTools().map((t) => t.toolId ?? '')),
      );
    }
  }

  selectAllReturn(): void {
    if (this.allReturnToolsVerified()) {
      this.returnVerifiedTools.set(new Set());
    } else {
      this.returnVerifiedTools.set(
        new Set(this.loanTools().map((t) => t.toolId ?? '')),
      );
    }
  }

  showExtendModal = signal<boolean>(false);
  extendReturnDate = signal<string>('');
  extendNotes = signal<string>('');

  loanResource = resource({
    params: () => this.route.snapshot.paramMap.get('id'),
    loader: async ({ params: id }) => {
      if (!id) return null;
      return await firstValueFrom(this.findOneLoan.execute(id));
    },
  });

  constructor() {
    effect(() => {
      const data = this.loanResource.value();
      if (data) setTimeout(() => this.patchForm(data));
    });
  }

  ngOnInit(): void {
    this.signatureSocket.joinRoom(this.sessionId);
    this.signatureSocket.joinRoom(this.deliverySessionId);
    this.signatureSocket.joinRoom(this.returnSessionId);
    this.signatureSocket.joinRoom(this.extendSessionId);

    this.signatureSocket.onSignatureReceived().subscribe((data) => {
      const actions = this.signatureActions[data.signatureType];
      actions(data.base64);
    });
  }

  ngAfterViewInit(): void {
    this.signaturePad?.clear();
  }

  patchForm(data: LoanResponseModel) {
    this.createdAt.set(data.createdAt);
    this.loanName.set(data.loanName);
    this.loanDepartment.set(data.loanDepartment.departmentName);
    this.LoanUseDescription.set(data.LoanUseDescription);
    this.loanStatus.set(data.loanStatus);
    this.loanNotes.set(data.loanNotes);
    this.loanReturnDate.set(data.loanReturnDate);
    this.loanDni.set(data.loanDni);
    this.loanTools.set(data.tools);
    this.verifiedTools.set(new Set());
    this.returnVerifiedTools.set(new Set());
    this.extendReturnDate.set(data.loanReturnDate?.slice(0, 16) ?? '');
  }

  toggleToolVerified(toolId: string) {
    this.verifiedTools.update((prev) => {
      const next = new Set(prev);
      next.has(toolId) ? next.delete(toolId) : next.add(toolId);
      return next;
    });
  }
  isToolVerified(toolId: string) {
    return this.verifiedTools().has(toolId);
  }

  toggleReturnToolVerified(toolId: string) {
    this.returnVerifiedTools.update((prev) => {
      const next = new Set(prev);
      next.has(toolId) ? next.delete(toolId) : next.add(toolId);
      return next;
    });
  }
  isReturnToolVerified(toolId: string) {
    return this.returnVerifiedTools().has(toolId);
  }

  confirmPcSignature(pad: SignaturePadComponent) {
    this.signatureImage.set(pad.toDataURL());
    this.showPcPad.set(false);
  }
  confirmDeliveryPcSignature(pad: SignaturePadComponent) {
    this.deliverySignatureImage.set(pad.toDataURL());
    this.showDeliveryPcPad.set(false);
  }
  confirmReturnPcSignature(pad: SignaturePadComponent) {
    this.returnSignatureImage.set(pad.toDataURL());
    this.showReturnPcPad.set(false);
  }
  confirmExtendPcSignature(pad: SignaturePadComponent) {
    this.extendSignatureImage.set(pad.toDataURL());
    this.showExtendPcPad.set(false);
  }

  readonly stepStates = computed(() => {
    const status = this.loanStatus();
    const order = ['Pendiente', 'Aprobado', 'Entregado', 'Devuelto'];
    const idx = order.indexOf(status);

    return {
      approval: status === 'Denegado' ? 'denied' : idx >= 1 ? 'done' : 'active',

      delivery: idx >= 2 ? 'done' : idx === 1 ? 'active' : 'pending',

      return: idx >= 3 ? 'done' : idx === 2 ? 'active' : 'pending',
    } as const;
  });

  stepCircleClass(state: 'active' | 'done' | 'pending' | 'denied'): string {
    return {
      done: 'bg-green-500 text-white',
      active: 'bg-blue-500  text-white',
      pending: 'bg-gray-200  text-gray-400',
      denied: 'bg-red-500   text-white',
    }[state];
  }

  stepLineClass(state: 'active' | 'done' | 'pending' | 'denied'): string {
    return {
      done: 'bg-green-400',
      denied: 'bg-red-300',
      active: 'bg-blue-300',
      pending: 'bg-gray-200',
    }[state];
  }

  async onApprove(status: boolean, state: string) {
    if (!this.signatureImage().length) {
      this.toastr.warning('La firma es necesaria.');
      return;
    }
    const response = await firstValueFrom(
      this.approveLoan.execute({
        loan: this.loanResource.value()?.loanId ?? '',
        status,
        state,
        comments: this.deliveryNotes(),
        sign: this.signatureImage(),
      }),
    );
    if (!validate(response)) {
      this.toastr.warning('No hubo cambios');
      return;
    }
    this.toastr.success('Permiso actualizado con éxito');
    this.signatureImage.set('');
    this.loanResource.reload();
  }

  async onDeliver(status: boolean, state: string) {
    if (!this.deliverySignatureImage().length) {
      this.toastr.warning('La firma del almacenista es necesaria.');
      return;
    }
    if (!this.allToolsVerified()) {
      this.toastr.warning(
        'Debes verificar todas las herramientas antes de confirmar.',
      );
      return;
    }

    const response = await firstValueFrom(
      this.deliverLoan.execute({
        loan: this.loanResource.value()?.loanId ?? '',
        status,
        state,
        comments: this.deliveryNotes(),
        sign: this.deliverySignatureImage(),
      }),
    );

    if (!validate(response)) {
      this.toastr.warning('No hubo cambios');
      return;
    }

    this.toastr.info('Permiso actualizado con éxito.');
    this.loanResource.reload();
  }

  async onReturn(status: boolean, state: string) {
    if (!this.canConfirmReturn()) {
      this.toastr.warning(
        'Verifica todas las herramientas y captura la firma.',
      );
      return;
    }

    const response = await firstValueFrom(
      this.returnLoan.execute({
        loan: this.loanResource.value()?.loanId ?? '',
        status,
        state,
        comments: this.returnNotes(),
        sign: this.returnSignatureImage(),
      }),
    );

    if (!validate(response)) {
      this.toastr.warning('No hubo cambios');
      return;
    }

    this.toastr.info('Permiso actualizado con éxito.');
    this.loanResource.reload();
  }

  async onExtend() {
    if (!this.extendReturnDate()) {
      this.toastr.warning('Selecciona una nueva fecha de retorno.');
      return;
    }

    const response = await firstValueFrom(
      this.extendLoan.execute({
        loan: this.loanResource.value()?.loanId ?? '',
        comments: this.extendNotes(),
        loanReturn: new Date(this.extendReturnDate()).toISOString(),
      }),
    );

    if (!validate(response)) {
      this.toastr.warning('No hubo cambios');
      return;
    }

    this.toastr.info('Permiso actualizado con éxito.');
    this.loanResource.reload();
    this.showExtendModal.set(false);
  }

  goBack() {
    this.location.back();
  }

  statusLabel(status: string): string {
    const map: Record<string, string> = {
      Pendiente: 'Pendiente',
      Aprobado: 'Aprobado',
      Denegado: 'Denegado',
      Entregado: 'Entregado',
      Devuelto: 'Devuelto',
    };
    return map[status] ?? status;
  }

  statusColorClass(status: string): string {
    const map: Record<string, string> = {
      Pendiente: 'bg-amber-100 text-amber-700 border border-amber-300',
      Aprobado: 'bg-green-100 text-green-700 border border-green-300',
      Denegado: 'bg-red-100   text-red-700   border border-red-300',
      Entregado: 'bg-blue-100  text-blue-700  border border-blue-300',
      Devuelto: 'bg-gray-100  text-gray-700  border border-gray-300',
    };
    return map[status] ?? 'bg-gray-100 text-gray-700 border border-gray-300';
  }
}
