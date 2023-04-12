// Import necessary modules
const app = require('express')(); // Express web framework
const http = require('http').Server(app); // HTTP server
const io = require('socket.io')(http, {
  cors: {
    origin: "*",
    methods: ["*"]
  }
}); // Socket.IO for real-time communication
const port = process.env.PORT || 4000; // Port to run the server on
require('dotenv').config();

const botToken = process.env.BOT_TOKEN; // Get bot token from environment variable
//const chatId = '1549238685' // Private bot channel
const chatId = '-904620196' // Test bot group chat

const { Telegraf } = require('telegraf'); // Telegraf for Telegram bot integration
const bot = new Telegraf(botToken); // Create a new Telegraf bot object

bot.telegram.getMe().then((botInfo) => {
  bot.options.username = botInfo.username
})

// Launch the Telegram bot
bot.launch();

// Serve local-chat page for testing
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/local-chat.html');
});

// We will create a namespace for each bot, on the client 
// side we do this with:
//  const namespace = oc.character.name.toLowerCase();
// then we use this in the set up for the socket connection:
//   const socket = io(`http://127.0.0.1:4000/${namespace}`);
const namespaces = io.of(/^\/\w+$/); // Create a Socket.IO namespace for each bot

// Handle connections to each namespace
namespaces.on('connection', (socket) => {
  const namespace = socket.nsp; // Get the namespace the user has connected to
  console.log(`A user has connected to ${namespace.name}`);

  // Handle changes in namespace (e.g. when a user switches to a different bot)
  socket.on("namespace change", (namespace) => {
    socket.leave(socket.room); // Leave the current room
    socket.join(namespace); // Join the new room
    socket.room = namespace; // Update the current room
    console.log(`User joined namespace ${namespace}`);
  });

  // Listen for messages in the group chat
  bot.on('message', (ctx) => {
    const message = ctx.message.text;
    console.log(`Received user message: ${message} in ${namespace.name}`);
    namespace.emit('user message', message); // Send the message to all connected clients in the namespace
  });

  // Handle AI messages from the bot
  socket.on('ai message', (msg) => {
    console.log(`Received ai message: ${msg} in ${namespace.name}`);
    namespace.emit('ai message', msg);
    bot.telegram.sendMessage(chatId, `${msg}`); // Send the message to Telegram
  });

  // Handle user messages from the client
  socket.on('user message', (msg) => {
    console.log(`Received user message: ${msg} in ${namespace.name}`);
    namespace.emit('user message', msg); // Emit the message to all clients in the namespace
  });
});

// Start the server
http.listen(port, () => {
  console.log(`Telegram bot integration server running at http://127.0.0.1:${port}/`);
});