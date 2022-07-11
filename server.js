const express = require("express");
const path = require("path");
const http = require("http");
const dotenv = require("dotenv");
const cors = require("cors");
const { addUser, getUser, deleteUser, getUsers } = require("./utils/users");

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = require("socket.io")(server);

app.use(cors());
app.use(express.static(path.join(__dirname, "/public")));

io.on("connection", (socket) => {
  console.log("A user connected with userId: " + socket.id);

  //#region Chat public
  socket.on("newuser", (username) => {
    socket.broadcast.emit("update", username + " joined the conversation");
  });

  socket.on("exituser", (username) => {
    socket.broadcast.emit("update", username + " left the conversation");
  });

  socket.on("chat", (message) => {
    socket.broadcast.emit("chat", message);
  });

  socket.on("typing", (data) => {
    socket.broadcast.emit("typing", data);
  });
  //#endregion

  //#region Chat room
  socket.on("join-room", ({ name, room }, callback) => {
    const { user, error } = addUser(socket.id, name, room);

    if (error) return callback(error);

    //user join room
    socket.join(user.room);

    //send notify cho room tru nguoi moi join room
    socket.in(room).emit("notification", {
      title: "Someone's here",
      description: `${user.name} just entered the room`,
    });

    // Gửi cho những thằng có mặt trong room bao gồm thằng gửi.
    io.in(room).emit("users", getUsers(room));

    callback();
  });

  socket.on("sendMessage", (message) => {
    const user = getUser(socket.id);

    //  Gửi cho tất cả client trong room bao gồm cả người gui
    io.in(user.room).emit("message", { user: user.name, text: message });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
    const user = deleteUser(socket.id);

    if (user) {
      //gui notify vao room tru nguoi moi join room
      io.in(user.room).emit("notification", {
        title: "Someone just left",
        description: `${user.name} just left the room`,
      });

      //hein thi list user trong room
      io.in(user.room).emit("users", getUsers(user.room));
    }
  });
  //#endregion
});

server.listen(process.env.APP_PORT, () => {
  console.log("Server listening on port", process.env.APP_PORT);
  console.log(
    `Chat room at http://${process.env.APP_HOST}:${process.env.APP_PORT}`
  );
});
