import { Injectable } from '@angular/core';
import { environment } from 'environments/environment.development';
import { Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root',
})
export class SignatureSocket {
  private readonly baseURL = `${environment.socketURL}`;
  private socket: Socket = io(this.baseURL);

  joinRoom(roomId: string) {
    this.socket.emit('join-room', roomId);
  }

  onSignatureReceived(): Observable<string> {
    return new Observable((observer) => {
      this.socket.on('signature-uploaded', (base64: string) => {
        observer.next(base64);
      });
    });
  }

  sendSignature(roomId: string, base64: string) {
    this.socket.emit('send-signature', { roomId, base64 });
  }
}
