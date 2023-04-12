console.log("running custom code");

import { io } from "https://cdn.socket.io/4.6.0/socket.io.esm.min.js";

const socket = io("http://127.0.0.1:4000");

socket.on('user message', function(msg) {
  console.log("user message", msg);

  oc.thread.messages.push({
    author: "user",
    content: msg
  });
});

oc.thread.on("MessageAdded", async function() {

    let lastMessage = oc.thread.messages.at(-1);
    if(lastMessage.author !== "ai") return; // only send AI messages

    socket.emit('ai message', lastMessage.content);
  });