const express = require("express");
const path = require("path");
const http = require("http");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = require("socket.io")(server);

app.use(express.static(path.join(__dirname, "/public")));

io.on("connection", (socket) => {
  socket.on("newuser", (username) => {
    socket.broadcast.emit("update", username + " joined the conversation");
  });

  socket.on("exituser", (username) => {
    socket.broadcast.emit("update", username + " left the conversation");
  });

  socket.on("chat", (message) => {
    socket.broadcast.emit("chat", message);
  });
});

server.listen(process.env.APP_PORT, () => {
  console.log("Server listening on port", process.env.APP_PORT);
  console.log(
    `Chat room at http://${process.env.APP_HOST}:${process.env.APP_PORT}`
  );
});
