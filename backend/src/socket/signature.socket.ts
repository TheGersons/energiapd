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
        (data: { roomId: string; base64: string }) => {
          this.io.to(data.roomId).emit("signature-uploaded", data.base64);
        },
      );

      socket.on("disconnect", () => {});
    });
  }
}
