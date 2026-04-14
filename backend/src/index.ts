import express, { Application } from "express";
import morgan from "morgan";
import cors from "cors";
import { route } from "@route/index";
import "dotenv/config";
import cookieParser from "cookie-parser";
import http from "http";
import { Server as SocketIOServer, Socket } from "socket.io";
import { SocketRoutes } from "socket/signature.socket";
import { v4 } from "uuid";
import { loanTask } from "jobs/loanExpiry.task";

class Server {
  private app!: Application;
  private httpServer: http.Server;
  public io: SocketIOServer;

  constructor() {
    this.app = express();
    this.config();
    this.routes();
    this.httpServer = http.createServer(this.app);
    this.io = new SocketIOServer(this.httpServer, { cors: { origin: "*" } });
    loanTask.initLoanJob();
    this.listenSockets();
  }

  config(): void {
    this.app.use(
      cors({
        origin: [
          "http://192.168.10.252:4201",
          "http://192.168.10.252:4201",
          "http://localhost:4200",
        ],
        credentials: true,
      }),
    );
    this.app.set("port", process.env.PORT ?? 3000);
    this.app.use(morgan("dev"));
    this.app.use(express.json());
    this.app.use(cookieParser(process.env.COOKIE_SECRET));
    this.app.set("trust proxy", "127.0.0.1");
    this.app.use(express.urlencoded({ extended: false }));
  }

  routes(): void {
    this.app.use("/api", route);
  }

  private listenSockets(): void {
    const socketRoutes = new SocketRoutes(this.io);
    socketRoutes.init();
  }

  start(): void {
    this.httpServer.listen(this.app.get("port"), () => {
      console.log("Running on port", this.app.get("port"));
    });
  }
}

const server = new Server();

server.start();

export { server };
