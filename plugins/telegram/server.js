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
const fs = require('fs')
const yaml = require('js-yaml')
require('dotenv').config();

// Set up logging
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`)
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});

const botToken = process.env.BOT_TOKEN; // Get bot token from environment variable
// Load bot info from bot-config.yaml file
logger.info('Loading bot-config file')
const yamlString = fs.readFileSync('bot-config.yml', 'utf8') // Load the YAML file into a string
const botConfig = yaml.load(yamlString) // Parse the YAML string into an object

const { Telegraf } = require('telegraf'); // Telegraf for Telegram bot integration
const bot = new Telegraf(botToken); // Create a new Telegraf bot object

// Retrieve information about the bot using the getMe() method from the Telegraf library 
bot.telegram.getMe().then((botInfo) => {
  // Set the bot's username using the information retrieved in the previous step
  bot.options.username = botInfo.username;
  //logger.info(bot.options.username)
});

// Launch the Telegram bot
bot.launch();

// Serve local-chat page for testing
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/local-chat.html');
});

// We will create a namespace for each bot, on the client 
// side we do this with:
//   const namespace = oc.character.name.toLowerCase();
// then we use this in the set up for the socket connection:
//   const socket = io(`http://127.0.0.1:4000/${namespace}`);
const namespaces = io.of(/^\/\w+$/); // Create a Socket.IO namespace for each bot

// Handle connections to each namespace
namespaces.on('connection', (socket) => {
  const namespace = socket.nsp; // Get the namespace the user has connected to
  //logger.info(`A user has connected to ${namespace.name}`);

  // Handle changes in namespace (e.g. when a user switches to a different bot)
  socket.on("namespace change", (namespace) => {
    socket.leave(socket.room); // Leave the current room
    socket.join(namespace); // Join the new room
    socket.room = namespace; // Update the current room
    logger.info(`User joined namespace ${namespace}`);
  });

  // Listen for user messages in Telegram
  bot.on('message', async (ctx) => {
    //const chatId = ctx.chat.id; // Chat Id from Telegram - Not using this for now
    const message = ctx.message.text; 
    await ctx.sendChatAction('typing'); // Send a typing indicator
    logger.info(`Received user message [${namespace.name} channel]: ${message}`);
    namespace.emit('user message', message); // Send the message to all connected clients in the namespace
  });

  // Handle AI messages from the bot
  socket.on('ai message', (msg) => {
    logger.info(`Received ai message [${namespace.name} channel]: ${msg}`);
    namespace.emit('ai message', msg);
    const chatId = botConfig[namespace.name.substring(1)].chat_id // Get the chat ID based on the namespace
    //if (bot.options.username === namespace.name.substring(1)) { // check bot name from config matches namespace
    logger.info('Send message to telegram chatId' + chatId)
    bot.telegram.sendMessage(chatId, `${msg}`); // Send the message to Telegram
    //}
  });

  // Handle user messages from the client
  socket.on('user message', (msg) => {
    logger.info(`Received user message [${namespace.name} channel]: ${msg}`);
    namespace.emit('user message', msg); // Emit the message to all clients in the namespace
  });
});

// Start the server
http.listen(port, () => {
  logger.info(`Telegram bot integration server running at http://127.0.0.1:${port}/`);
});