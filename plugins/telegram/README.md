# OpenCharacters Telegram Plugin

This Telegram Plugin is a plugin for OpenCharacters that allows users to integrate with Telegram via the bot API. The plugin consists of two main elements: custom javascript that needs to be added to the character's advanced options custom js code and a nodejs server that uses socket.io and telegraf to integrate with Telegram.

This has been developed and tested locally and as such it's easiest to download the OpenCharacters code and run it locally to communicate with the Telegram.  It should be entirely possible to utilise other message brokers than Socket.io and extend the plugin if required. 

## Installation

To install the plugin, follow these steps:

Clone the OpenCharacters repository locally

    git clone https://github.com/josephrocca/OpenCharacters.git

Install the necessary dependencies:

    cd plugins/telegram/
    npm install

Set up a Telegram bot by following the instructions in the Telegram Bot API documentation. Note the bot token, as it will be needed later.

Change the privacy settings for the bot by sending the command /setprivacy to the BotFather and selecting "Disable". This will allow the bot to receive all messages sent to a group/direct chat, rather than only messages specifically directed at the bot (/command). You can also use the new /mybots comment in the BotFather chat which gives a little menu for this.

You can either direct message the character or create a group chat so that multiple people can message the character. If creating a group ensure to change the bot's privacy settings before adding it to the group, if you've already added the bot before changing the privacy settings, remove and re-add the bot to the group.

Next we need the chat ID for the conversation. The easiest way to get this is to message the bot in the room you wish to connect to OpenCharacters, then with the bot token the Botfather bot gave you earlier open this URL in a browser. It will return a json document and you can grab the relevent chat id value from it. 

    https://api.telegram.org/bot<BOT_TOKEN>/getUpdates

Next add the custom javascript to the character's advanced options custom js code. You can find the code in the file custom.js.

Create an .env file to hold the Telegram bot token in `plugins/telegram/.env`

    BOT_TOKEN = "12345678:XXXXXYYYYYYZZZZZZZ"

Start the Telegram integration server process with the following command. Ensure you are in the plugins/telegram folder. 

    npm start

You should now see the server process listening on port 4000 on 127.0.0.1.

The web server launched by node (express) is also configured to serve the OpenCharacter files (index.html and utils.js) from the main folder.

# Usage

Once the server is running and the custom Javascript installed to the character you should be able to interact with the bot via Telegram.

Sending a message to the bot via Telegram, you should see the message being logged in the integration server console and then all going good it should appear in the OpenCharacters chat window. When the character responds this message will then be sent back to the Telegram chat. 

# Contributing

If you'd like to contribute to the project, feel free to fork the repository and submit a pull request. We welcome all contributions!

That should provide all the necessary information for setting up a Telegram bot and integrating it with the OpenCharacters plugin. Let me know if you have any further questions or if there's anything else you'd like me to include.
