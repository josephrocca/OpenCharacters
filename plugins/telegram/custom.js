console.log("Running Telegram integration custom code");

import("https://cdn.socket.io/4.6.0/socket.io.esm.min.js").then(io => {
  const namespace = oc.character.name.toLowerCase();
  console.log(namespace);
  const socket = io.default(`http://127.0.0.1:3000/${namespace}`);

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

    console.log(lastMessage);
    console.log("ai message", lastMessage.content);
    socket.emit('ai message', lastMessage.content);
  });
});