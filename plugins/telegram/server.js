// Import necessary modules
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
    new winston.transports.File({ filename: 'logs/server.log' }),
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

// We will create a namespace for each character
for (const [character, config] of Object.entries(botConfig)) {
  const namespace = io.of(`/${character}`); // Create a namespace for the character
  logger.info(`Namespace created: /${character}`); // Log that the namespace was created
  
  // Handle connections to the namespace
  namespace.on('connection', (socket) => {
    logger.info(`A user has connected to ${namespace.name}`);
    
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
      const chatId = config.chat_id; // Get the chat ID from the YAML config
      logger.info(`Send message to Telegram chatId ${chatId}`);
      bot.telegram.sendMessage(chatId, `${msg}`); // Send the message to Telegram
    });
    
    // Handle user messages from the client
    socket.on('user message', (msg) => {
      logger.info(`Received user message [${namespace.name} channel]: ${msg}`);
      namespace.emit('user message', msg); // Emit the message to all clients in the namespace
    });
  });
}

// Start the server
http.listen(port, () => {
  logger.info(`Telegram bot integration server running at http://127.0.0.1:${port}/`);
});