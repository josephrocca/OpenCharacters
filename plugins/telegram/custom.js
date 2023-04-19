console.log("Running Telegram integration custom code");

import("https://cdn.socket.io/4.6.0/socket.io.esm.min.js").then(io => {
  const namespace = oc.character.name.toLowerCase();
  const socket = io.default(`http://127.0.0.1:3000/${namespace}`);
  console.log(`Connected to ${namespace}`);

  socket.on('user message', function(message, chatId, chatName, user) {
    if (chatName == null)
      var chatName = "Private Chat";
    console.log(`Received user message from ${user} in [${chatName} / ${chatId}]: ${message}`);

    oc.thread.customData.chatId = chatId;
    oc.thread.messages.push({
      author: "user",
      content: `${user}: ${message}`,
      name: user
    });
  });

  oc.thread.on("MessageAdded", async function() {
    let lastMessage = oc.thread.messages.at(-1);
    if(lastMessage.author !== "ai") return; // only send AI messages
    console.log("ai message", lastMessage.content, oc.thread.customData.chatId);
    socket.emit('ai message', lastMessage.content, oc.thread.customData.chatId);
  });
});