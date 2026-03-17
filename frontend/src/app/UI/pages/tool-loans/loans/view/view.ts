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
    Loader,
    SignaturePadComponent,
    DatePipe,
  ],
  templateUrl: './view.html',
  styleUrl: './view.scss',
})
export class View implements OnInit, AfterViewInit {
  @ViewChild('signaturePad')
  public signaturePad!: SignaturePadComponent;

  @ViewChild('deliverySignaturePad')
  public deliverySignaturePad!: SignaturePadComponent;

  public signaturePadOptions: NgSignaturePadOptions = {
    maxWidth: 0.5,
    velocityFilterWeight: 0.7,
  };

  private readonly location = inject(Location);
  private readonly route = inject(ActivatedRoute);
  private readonly findOneLoan = inject(FindOneLoanUseCase);
  private signatureSocket = inject(SignatureSocket);
  private approveLoan = inject(ApproveLoanUseCase);
  private sessionId = uuidv4();
  private deliverySessionId = uuidv4();
  private toastr = inject(ToastrService);

  url = `${environment.host}firma-herramientas/${this.sessionId}`;
  deliveryUrl = `${environment.host}firma-herramientas/${this.deliverySessionId}`;

  sTab = signal<'detail' | 'state' | 'actions'>('detail');

  // Loan fields
  createdAt = signal<string>('');
  loanName = signal<string>('');
  loanDepartment = signal<string>('');
  loanDni = signal<string>('');
  LoanUseDescription = signal<string>('');
  loanStatus = signal<string>('');
  loanNotes = signal<string>('');
  loanReturnDate = signal<string>('');
  loanTools = signal<ToolModel[]>([]);

  // Approval signature
  signatureImage = signal<string>('');
  showPcPad = signal<boolean>(false);

  // Delivery signature (UI only — wire up onDeliver() with your use case)
  deliverySignatureImage = signal<string>('');
  showDeliveryPcPad = signal<boolean>(false);
  deliveryNotes = signal<string>('');

  // Tool verification checklist for delivery
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

  toggleToolVerified(toolId: string) {
    this.verifiedTools.update((prev) => {
      const next = new Set(prev);
      next.has(toolId) ? next.delete(toolId) : next.add(toolId);
      return next;
    });
  }

  isToolVerified(toolId: string): boolean {
    return this.verifiedTools().has(toolId);
  }

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
      if (data) {
        setTimeout(() => this.patchForm(data));
      }
    });
  }

  ngOnInit(): void {
    // Approval signature socket
    this.signatureSocket.joinRoom(this.sessionId);
    this.signatureSocket.onSignatureReceived().subscribe((base64) => {
      this.signatureImage.set(base64);
    });

    // Delivery signature socket — uses a separate room
    this.signatureSocket.joinRoom(this.deliverySessionId);
  }

  ngAfterViewInit(): void {
    if (this.signaturePad) {
      this.signaturePad.set('minWidth', 5);
      this.signaturePad.clear();
    }
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
  }

  confirmPcSignature(pad: SignaturePadComponent) {
    const base64 = pad.toDataURL();
    this.signatureImage.set(base64);
    this.showPcPad.set(false);
  }

  confirmDeliveryPcSignature(pad: SignaturePadComponent) {
    const base64 = pad.toDataURL();
    this.deliverySignatureImage.set(base64);
    this.showDeliveryPcPad.set(false);
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
      }),
    );
    if (!validate(response)) {
      this.toastr.warning('No hubo cambios');
      return;
    }
    this.toastr.success('Permiso actualizado con éxito');
    this.loanResource.reload();
  }

  async onDeliver() {
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
    // TODO: implementar con el use case de entrega
    // Conectar con: approveLoan.execute({ loan, status: true, state: 'Entregado' })
    this.toastr.info('Implementar lógica de entrega');
  }

  goBack(): void {
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
      Denegado: 'bg-red-100 text-red-700 border border-red-300',
      Entregado: 'bg-blue-100 text-blue-700 border border-blue-300',
      Devuelto: 'bg-gray-100 text-gray-700 border border-gray-300',
    };
    return map[status] ?? 'bg-gray-100 text-gray-700 border border-gray-300';
  }
}
