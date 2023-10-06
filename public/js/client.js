//required for front end communication between client and server

(function () {
  const app = document.querySelector(".app");
  // create socket.io instance for client-server communication
  const socket = io();
// variable to store the user's username
  let userName = "";
  //varibale to store the user's unique id
  let id;

  // funtion when a new user joins
  const newUserConnected = function (username) {
    

    //give the user a random unique id
    id = Math.floor(Math.random() * 1000000);
    userName = 'user-' +id;
    //console.log(typeof(userName));   
    

    //emit an event with the user id
    socket.emit("new user", userName);
    //call
    addToUsersBox(userName);
};
// Event-listner for join button click
  app.querySelector("#join-user").addEventListener("click", function () {
    let username = app.querySelector(".join-screen #username").value;
    if (username.length == 0) {
      return;
    }
    // emit a new user event with the username entered
    socket.emit("newuser", username);
    userName = username;
    app.querySelector(".join-screen").classList.remove("active");
    app.querySelector(".chat-screen").classList.add("active");
  });
  // event listener for the send button
  app.querySelector(".chat-screen #send-message").addEventListener("click", function () {
    let message = app.querySelector(".chat-screen #message-input").value;
    if (message.length == 0) {
      return;
    }
    // render a chat message and emit a chat event to server
    renderMessage("my", {
      username: userName,
      text: message,
    });
    socket.emit("chat", {
      username: userName,
      text: message,
    });
    app.querySelector(".chat-screen #message-input").value = "";
  });
// event listener for the exit button
  app.querySelector(".chat-screen #exit-chat").addEventListener("click", function () {
    socket.emit("exituser", userName);
    window.location.href = window.location.href;
  });
// event listener for the update event received from the server
  socket.on("update", function (update) {
    renderMessage("update", update);
  });
// event listener for the chat event received from the server
  socket.on("chat", function (message) {
    renderMessage("other", message);
  });
// function to render chat messages
  function renderMessage(type, message) {
    const time = new Date();
    const formattedTime = time.toLocaleString("en-US", { hour: "numeric", minute: "numeric" });
    let messageContainer = app.querySelector(".chat-screen .messages");
    if (type === "my") {
      // create and append message element for the user's message
      let ele = document.createElement("div");
      ele.setAttribute("class", "message my-message");
      ele.innerHTML = `
        <div>
          <div class="name">You</div>
          <div class="text">${message.text}</div>
          <span class="time_date">${formattedTime}</span>
        </div>
      `;
      messageContainer.appendChild(ele);
    } else if (type === "other") {
      // create and append message element for other user's message
      let ele = document.createElement("div");
      ele.setAttribute("class", "message other-message");
      ele.innerHTML = `
        <div>
          <div class="name">${message.username}</div>
          <div class="text">${message.text}</div>
          <span class="time_date">${formattedTime}</span>
        </div>
      `;
      messageContainer.appendChild(ele);
    } else if (type === "update") {
      let ele = document.createElement("div");
      ele.setAttribute("class", "update");
      ele.innerText = message;
      messageContainer.appendChild(ele);
    }
    // scroll the message to top
    messageContainer.scrollTop = messageContainer.scrollHeight - messageContainer.clientHeight;
  }
})();