// Import necessary modules
require('events').EventEmitter.defaultMaxListeners = Infinity; // Increase the maximum number of event listeners to Infinity
const path = require('path');
const app = require('express')(); // Express web framework
const http = require('http').Server(app); // HTTP server
const io = require('socket.io')(http, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
}); // Socket.IO for real-time communication
const port = process.env.PORT || 3000; // Port to run the server on
const fs = require('fs')
const yaml = require('js-yaml')

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
    new winston.transports.File({ filename: 'logs/server.log' }),
  ],
});

const botToken = process.env.BOT_TOKEN; // Get bot token from environment variable
// Load bot info from bot-config.yaml file
logger.info('Loading bot-config file')
const yamlString = fs.readFileSync('bot-config.yml', 'utf8') // Load the YAML file into a string
const botConfig = yaml.load(yamlString) // Parse the YAML string into an object

// Set up Telegram bot with Telegraf
const { Telegraf } = require('telegraf'); // Telegraf for Telegram bot integration

// We will create a bot for each character in the bot-config file
for (const [character, config] of Object.entries(botConfig)) {
  const bot = new Telegraf(config.bot_token); // Create a new Telegraf bot object

  // Retrieve information about the bot using the getMe() method from the Telegraf library 
  bot.telegram.getMe().then((botInfo) => {
    // Set the bot's username using the information retrieved in the previous step
    bot.options.username = botInfo.username;
    //logger.info(bot.options.username)
  });

  // Launch the Telegram bot
  bot.launch();
  logger.info(`Launched Telegram bot for ${character} with token ${botToken}`);

  // Create a dynamic namespace for each character
  //const namespaces = io.of(/^\/[\w\-]+$/);
  const namespaces = io.of(`/${character}`);

  // Handle connections to each namespace
  namespaces.on('connection', (socket) => {
    const namespace = socket.nsp; // Get the namespace the user has connected to
    logger.info(`A user has connected to ${namespace.name}`);

    // Handle changes in namespace (e.g. when a user switches to a different bot - this is used more for testing with local-chat.html)
    socket.on("namespace change", (namespace) => {
      socket.leave(socket.room); // Leave the current room
      socket.join(namespace); // Join the new room
      socket.room = namespace; // Update the current room
      logger.info(`Test user joined namespace ${namespace}`);
    });

    // Listen for user messages in Telegram
    bot.on('message', async (ctx) => {
      const chatId = ctx.chat.id; // Chat Id from Telegram
      const chatName = ctx.message.chat.title;
      const user = ctx.message.from; // User info from Telegram
      const message = ctx.message.text; 
      await ctx.sendChatAction('typing'); // Send a typing indicator
      logger.info(`Received user message from ${user.first_name} on [${namespace.name} channel]: ${message}`);
      namespace.emit('user message', message, chatId, chatName, user.first_name); // Send the message to all connected clients in the namespace
    });

    // Handle AI messages from the bot
    socket.on('ai message', (message, chatId) => {
      logger.info(`Received ai message [${namespace.name} channel]: ${message} ${chatId}}`);
      //namespace.emit('ai message', message);
      //const chatId = botConfig[namespace.name.substring(1)].chat_id // Get the chat ID based on the namespace
      logger.info('Send message to telegram chatId ' + chatId)
      bot.telegram.sendMessage(chatId, `${message}`); // Send the message to Telegram
      //}
    });

    // Handle user messages from the client
    socket.on('user message', (message) => {
      logger.info(`Received user message [${namespace.name} channel]: ${message}`);
      namespace.emit('user message', message); // Emit the message to all clients in the namespace
    });
  });
};

// Serve local-chat page for testing
app.get('/local-chat', (req, res) => {
  res.sendFile(__dirname + '/local-chat.html');
});

// Serve OpenCharacters page
const indexPath = path.join(__dirname, '..', '..', 'index.html');
const utilsPath = path.join(__dirname, '..', '..', 'utils.js');

app.get('/', (req, res) => {
  res.sendFile(indexPath);
});

app.get('/utils.js', (req, res) => {
  res.sendFile(utilsPath);
});

// Start the server
http.listen(port, () => {
  logger.info(`Telegram bot integration server running at http://127.0.0.1:${port}/`);
});