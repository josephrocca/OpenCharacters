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

Change the privacy settings for the bot by sending the command /setprivacy to the BotFather and selecting "Disable". This will allow the bot to receive all messages sent to a group/direct chat, rather than only messages specifically directed at the bot (/command). 

You can either direct message the character or create a group chat so that multiple people can message the character. If creating a group ensure to change the bot's privacy settings before adding it to the group, if you've already done this change the privacy settings, remove and re-add the bot to the group. 

Next we need the chat ID for the conversation (multiple chat support will probably come soon). The easiest way to get this is to message the bot in the room you wish to connect to OpenCharacters, then with the bot token the Botfather bot gave you earlier open this URL in a browser. It will return a json document and you can grab the chat id value from it. 

    https://api.telegram.org/bot<BOT_TOKEN>/getUpdates

Next add the custom javascript to the character's advanced options custom js code. You can find the code in the file custom.js.

Create an .env file to hold the Telegram bot token in plugins/telegram/.env. 

    BOT_TOKEN = "12345678:XXXXXYYYYYYZZZZZZZ"
    CHAT_ID = "1234567890"

Start the Telegram integration server process with the following command. Ensure you are in the plugins/telegram folder. 

    npm start

You should now see the server process listening on port 4000 on 127.0.0.1.

The next step is to serve the OpenCharacters index.html and other files, for now I've done this via the web server in the VSCode Live Preview plugin. https://marketplace.visualstudio.com/items?itemName=ms-vscode.live-server

This can be added to VSCode via the extentions sidebar tab. Then you can right click on the index.html file in the OpenCharacters folder and click Live Preview. It will open the web page in VSCode but you can also open it via a separate browser on http://127.0.0.1:3000/index.html

# Usage

Once the server is running and the OpenCharacters code served via Live Preview and the custom Javascript installed to the character you can interact with the bot via Telegram.

Sending a message to the bot via Telegram, you should see the message being logged in the integration server console and then all going good it should appear in the OpenCharacters chat window. When the character responds this message will then be sent back to the Telegram chat. 

# Contributing

If you'd like to contribute to the project, feel free to fork the repository and submit a pull request. We welcome all contributions!

That should provide all the necessary information for setting up a Telegram bot and integrating it with the OpenCharacters plugin. Let me know if you have any further questions or if there's anything else you'd like me to include.
