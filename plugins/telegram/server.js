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

// Load bot info from bot-config.yaml file
logger.info('Loading bot-config file')
const yamlString = fs.readFileSync('bot-config.yml', 'utf8') // Load the YAML file into a string
const botConfig = yaml.load(yamlString) // Parse the YAML string into an object

// Set up Telegram bot with Telegraf
const { Telegraf } = require('telegraf'); // Telegraf for Telegram bot integration
const { encode } = require('punycode');

// Escape Markdown characters so Telegram doesn't complain
function escapeMarkdownV2(text) {
  const ESCAPE_CHARACTERS = /[_*[\]()~>#\+\-=|{}.!]/g;
  return text.replace(ESCAPE_CHARACTERS, '\\$&');
}

// Set up a global error handler
process.on('uncaughtException', (error) => {
  logger.error('Unhandled exception: ', error);
});

// We will create a bot for each character in the bot-config file
for (const [character, config] of Object.entries(botConfig)) {
  const bot = new Telegraf(config.bot_token); // Create a new Telegraf bot object

  // Launch the Telegram bot
  bot.launch();
  logger.info(`Launched Telegram bot for ${character} with token ${config.bot_token}`);

  // Enable graceful stop
  process.once('SIGINT', () => bot.stop('SIGINT'));
  process.once('SIGTERM', () => bot.stop('SIGTERM'));

  // Create a dynamic namespace for each character
  const namespaces = io.of(`/${character}`);

  // Handle connections to each namespace
  namespaces.on('connection', (socket) => {
    const namespace = socket.nsp; // Get the namespace the user has connected to
    logger.info(`A user has connected to ${namespace.name}`);

    // Listen for user messages in Telegram
    bot.on('message', async (ctx) => {
      try {
        if (ctx.message.new_chat_member) {
          await ctx.sendChatAction('typing'); // Send a typing indicator
          const chatId = ctx.message.chat.id;
          const chatName = ctx.message.chat.title;
          const newMemberName = ctx.message.new_chat_member.first_name;
          bot.telegram.sendMessage(chatId, `Hi ${newMemberName}. ${config.greeting_message}`); // Send new user greeting message to Telegram chat
        } else if (ctx.message.text) { // message handler
          await ctx.sendChatAction('typing'); // Send a typing indicator
          const chatId = ctx.message.chat.id;
          const chatName = ctx.message.chat.title;
          const newMembers = ctx.message.new_chat_members;
          const user = ctx.message.from; // User info from Telegram
          const message = ctx.message.text; 
          logger.info(`Received user message from ${user.first_name} on [${namespace.name} channel]: ${message}`);
          namespace.emit('user message', message, chatId, chatName, user.first_name); // Send the message to all connected clients in the namespace
        }
      } catch (error) {
        logger.error('Error handling messages from Telegram: ' + error);
        ctx.reply('Sorry, I am having trouble processing your request. Please try again later.');
      }
    });

    // Handle AI messages from the bot
    socket.on('ai message', async (message, chatId) => {
      try {
        logger.info(`Received ai message [${namespace.name} channel]: ${message} ${chatId}}`);
        const escapedMessage = escapeMarkdownV2(message);
        bot.telegram.sendMessage(chatId, {text: escapedMessage, parse_mode: 'MarkdownV2'});
      } catch (error) {
        logger.error('Error handling AI message: ' + error);
        bot.telegram.sendMessage(chatId, 'Sorry, I am having trouble processing your request. Please try again later.');
      }
    });
  });
};

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
try {
  http.listen(port, () => {
    logger.info(`Telegram bot integration server running at http://127.0.0.1:${port}/`);
  });
} catch (error) {
  logger.error('Error with Express server: ' + error);
}