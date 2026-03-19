import { Socket, Server as SocketIOServer } from "socket.io";

export class SocketRoutes {
  constructor(private io: SocketIOServer) {}

  public init(): void {
    this.io.on("connection", (socket: Socket) => {
      socket.on("join-room", (roomId: string) => {
        socket.join(roomId);
      });

      socket.on(
        "send-signature",
        (data: { roomId: string; base64: string; signatureType: string }) => {
          this.io.to(data.roomId).emit("signature-uploaded", {
            base64: data.base64,
            signatureType: data.signatureType,
          });
        },
      );

      socket.on("disconnect", () => {});
    });
  }
}
