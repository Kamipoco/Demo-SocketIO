(function () {
  const app = document.querySelector(".app");
  let feedback = document.querySelector(".feedback");
  const inputField = app.querySelector(".chat-screen #message-input");
  const socket = io();

  let uname;

  //new user
  app
    .querySelector(".join-screen #join-user")
    .addEventListener("click", function () {
      let username = app.querySelector(".join-screen #username").value;

      if (username.length == 0) {
        return;
      }

      socket.emit("newuser", username);
      uname = username;
      app.querySelector(".join-screen").classList.remove("active");
      app.querySelector(".chat-screen").classList.add("active");
    });

  //chat
  app
    .querySelector(".chat-screen #send-message")
    .addEventListener("click", function () {
      let message = app.querySelector(".chat-screen #message-input").value;

      if (message.length == 0) {
        return;
      }

      renderMessage("my", {
        username: uname,
        text: message,
        time: new Date().toLocaleTimeString(),
      });

      socket.emit("chat", {
        username: uname,
        text: message,
      });

      app.querySelector(".chat-screen #message-input").value = "";
    });

  //exit
  app
    .querySelector(".chat-screen #exit-chat")
    .addEventListener("click", function () {
      socket.emit("exituser", uname);
      window.location.href = window.location.href;
    });

  socket.on("update", function (message) {
    renderMessage("update", message);
  });

  socket.on("chat", function (message) {
    feedback.innerHTML = "";
    message.time = new Date().toLocaleTimeString();
    renderMessage("other", message);
  });

  //typing
  inputField.addEventListener("keyup", () => {
    socket.emit("typing", {
      isTyping: inputField.value.length > 0,
      username: uname,
    });
  });

  socket.on("typing", function (data) {
    const { isTyping, username } = data;

    if (isTyping) {
      feedback.innerHTML = "<p><em>" + username + " is typing...</em></p>";
    } else {
      feedback.innerHTML = "";
    }
  });

  function renderMessage(type, message) {
    let messageContainer = app.querySelector(".chat-screen .messages");

    if (type == "my") {
      let el = document.createElement("div");
      el.setAttribute("class", "message my-message");
      el.innerHTML = `
        <div class="my-box">
            <div class="name">You<p>${message.time}</p></div>
            <div class="text">${message.text}</div>
        </div>
      `;
      messageContainer.appendChild(el);
    } else if (type == "other") {
      let el = document.createElement("div");
      el.setAttribute("class", "message other-message");
      el.innerHTML = `
          <div>
              <div class="name">${message.username}<p>${message.time}</p></div>
              <div class="text">${message.text}</div>
          </div>
        `;
      messageContainer.appendChild(el);
    } else if (type == "update") {
      let el = document.createElement("div");
      el.setAttribute("class", "update");
      el.innerHTML = message;
      messageContainer.appendChild(el);
    }

    //scroll chat to end
    messageContainer.scrollTop =
      messageContainer.scrollHeight - messageContainer.clientHeight;
  }
})();
