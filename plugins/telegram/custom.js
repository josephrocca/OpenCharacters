console.log("Running Telegram integration custom code");

import { io } from "https://cdn.socket.io/4.6.0/socket.io.esm.min.js";

// Create message namespace just for this character/bot
const namespace = oc.character.name.toLowerCase();
const socket = io(`http://127.0.0.1:4000/${namespace}`);

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

  console.log("ai message", lastMessage.content);
  socket.emit('ai message', lastMessage.content);
});