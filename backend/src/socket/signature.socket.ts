import { Socket, Server as SocketIOServer } from "socket.io";

export class SocketRoutes {
  constructor(private io: SocketIOServer) {}

  public init(): void {
    this.io.on("connection", (socket: Socket) => {
      console.log("Nuevo dispositivo conectado:", socket.id);

      socket.on("join-room", (roomId: string) => {
        socket.join(roomId);
        console.log(`Dispositivo unido a la sala: ${roomId}`);
      });

      socket.on(
        "send-signature",
        (data: { roomId: string; base64: string }) => {
          this.io.to(data.roomId).emit("signature-uploaded", data.base64);
          console.log(`Firma enviada a la sala: ${data.roomId}`);
        },
      );

      socket.on("disconnect", () => {
        console.log("Dispositivo desconectado");
      });
    });
  }
}
