# OpenCharacters Telegram Plugin

This Telegram Plugin is a plugin for OpenCharacters that allows users to integrate with Telegram via the bot API. The plugin consists of two main elements: custom javascript that needs to be added to the characters' advanced options custom js code and a nodejs server that uses socket.io and telegraf to integrate with Telegram.

This has been developed and tested locally and as such it's easiest to download the OpenCharacters code and run it locally to communicate with the Telegram.  It should be entirely possible to utilise other message brokers than Socket.io and extend the plugin if required. 

## Installation

To install the plugin, follow these steps:

Clone the OpenCharacters repository locally

    git clone https://github.com/josephrocca/OpenCharacters.git

Install the necessary dependencies:

    cd plugins/telegram/
    npm install

Set up a Telegram bot by following the instructions in the Telegram Bot API documentation. Note the bot token, as it will be needed later.

Change the privacy settings for the bot by sending the command /setprivacy to the BotFather and selecting "Disable". This will allow the bot to receive all messages sent to a group, rather than only messages specifically directed at the bot.

Add the custom javascript to the characters' advanced options custom js code. You can find the code in the file custom.js.

Create a .env file to hold the Telegram bot token in plugins/telegram/.env. 

    BOT_TOKEN = "12345678:YYYYYYY"
    CHAT_ID = "1234567890"

Start the server:

    npm start

# Usage

Once the server is running, you can interact with the bot via Telegram.

# Contributing

If you'd like to contribute to the project, feel free to fork the repository and submit a pull request. We welcome all contributions!

That should provide all the necessary information for setting up a Telegram bot and integrating it with the OpenCharacters plugin. Let me know if you have any further questions or if there's anything else you'd like me to include.
