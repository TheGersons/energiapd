import { CommonModule, Location } from '@angular/common';
import {
  AfterViewInit,
  Component,
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
  ],
  templateUrl: './view.html',
  styleUrl: './view.scss',
})
export class View implements OnInit, AfterViewInit {
  @ViewChild('signature')
  public signaturePad!: SignaturePadComponent;
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
  private toastr = inject(ToastrService);
  url = `${environment.host}firma-herramientas/${this.sessionId}`;

  sTab = signal<'detail' | 'state' | 'actions'>('detail');

  createdAt = signal<string>('');
  loanName = signal<string>('');
  loanDepartment = signal<string>('');
  loanDni = signal<string>('');
  LoanUseDescription = signal<string>('');
  loanStatus = signal<string>('');
  loanNotes = signal<string>('');
  loanReturnDate = signal<string>('');
  signatureImage = signal<string>('');
  showPcPad = signal<boolean>(false);
  loanTools = signal<ToolModel[]>([]);

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
    this.signatureSocket.joinRoom(this.sessionId);
    this.signatureSocket.onSignatureReceived().subscribe((base64) => {
      this.signatureImage.set(base64);
    });
  }

  ngAfterViewInit(): void {
    this.signaturePad.set('minWidth', 5);
    this.signaturePad.clear();
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
  }

  confirmPcSignature(pad: any) {
    const base64 = pad.toDataURL();
    this.signatureImage.set(base64);
    this.showPcPad.set(false);
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
      }),
    );
    if (!validate(response)) {
      this.toastr.warning('No hubo cambios');
      return;
    }

    this.toastr.success('Permiso actualizado con exito');
    this.loanResource.reload();
  }

  goBack(): void {
    this.location.back();
  }
}
