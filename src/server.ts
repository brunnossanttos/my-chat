import express, { Application, Response } from "express";
import http from "http";
import { Server } from "socket.io";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class App {
  private app: Application;
  private http: http.Server;
  private io: Server;
  constructor() {
    this.app = express();
    this.http = http.createServer(this.app);
    this.io = new Server(this.http);
    this.listenSocket();
    this.setupRoutes();
  }
  listenServer() {
    this.http.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
  }

  listenSocket() {
    this.io.on("connection", (socket) => {
      console.log("a user connected", socket.id);

      socket.on("message", (msg) => {
        this.io.emit("message", msg);
      });
    });
  }

  setupRoutes() {
    this.app.get("/", (req, res: Response) => {
      res.sendFile(__dirname + "/index.html");
    });
  }
}

const app = new App();

app.listenServer();
