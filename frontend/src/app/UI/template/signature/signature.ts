import { Component, inject, ViewChild } from '@angular/core';
import {
  SignaturePadComponent,
  NgSignaturePadOptions,
} from '@almothafar/angular-signature-pad';
import { SignatureSocket } from '@base/socket/signature.socket';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-signature',
  imports: [SignaturePadComponent],
  templateUrl: './signature.html',
  styleUrl: './signature.scss',
})
export class Signature {
  @ViewChild('signature')
  public signaturePad!: SignaturePadComponent;
  sessionId!: string;

  public signaturePadOptions: NgSignaturePadOptions = {
    maxWidth: 0.5,
    velocityFilterWeight: 1,
    canvasWidth: 300,
    canvasHeight: 200
  };

  private signatureSocket = inject(SignatureSocket);
  private route = inject(ActivatedRoute);

  ngAfterViewInit() {
    this.signaturePad.set('minWidth', 5);
    this.signaturePad.clear();
    this.sessionId = this.route.snapshot.params['id'];
  }

  drawComplete(event: MouseEvent | Touch) {
    console.log('Completed drawing', event);
    console.log(this.signaturePad.toDataURL());
  }

  drawStart(event: MouseEvent | Touch) {
    console.log('Start drawing', event);
  }

  save() {
    const base64 = this.signaturePad.toDataURL('image/png');
    this.signatureSocket.sendSignature(this.sessionId, base64);
  }

  clear() {
    this.signaturePad.clear();
  }
}
