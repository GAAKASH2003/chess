import express from "express";
import http from "http";
import bodyParser from "body-parser";
import { Server } from "socket.io";
import { setupSocketHandlers } from "./socket.js";

const app = express();
app.use(bodyParser.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Adjust as needed for CORS
  },
});

// Setup socket handlers after io is created
setupSocketHandlers(io);

app.get("/", (req, res) => {
  res.send("Hello World");
});

server.listen(3001, () => {
  console.log("Server is running on port 3001");
});

export default { io };
