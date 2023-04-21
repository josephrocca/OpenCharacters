# OpenCharacters Telegram Plugin

This Telegram Plugin is a plugin for OpenCharacters that allows users to integrate with Telegram via the bot API. The plugin consists of two main elements: custom javascript that needs to be added to the character's advanced options custom js code and a node.js server that uses socket.io and telegraf to integrate with Telegram.

This has been developed and tested locally I'm working on an example with the integration server running on Glitch to make it easier to get up and running.

## Features

* Support for multiple Telegram bots
* Each bot can handle multiple characters, split by thread / Telegram chat
* Bot checks source chat_id in telegram messages and ignores all others (in Telegram bots are not private by default and must be secured)

## Requirements

Node.js is required to run this plugin - see https://nodejs.org

## Installation

To install the plugin, follow these steps:

Clone the OpenCharacters repository locally

    git clone https://github.com/josephrocca/OpenCharacters.git

Install the necessary dependencies:

    cd plugins/telegram/
    npm install

Set up a Telegram bot by following the instructions in the Telegram Bot API documentation (https://core.telegram.org/bots/tutorial#getting-ready). Note the bot token, as it will be needed later.

Change the privacy settings for the bot by sending the command `/setprivacy` to the BotFather and selecting "Disable". This will allow the bot to receive all messages sent to a group/direct chat, rather than only messages specifically directed at the bot (`/command`). You can also use the new /mybots command in the BotFather chat which gives a little menu for this.

You can either direct message the character or create a group chat so that multiple people can message the character. If creating a group ensure to change the bot's group privacy settings before adding it to the group, if you've already added the bot before changing the privacy settings, remove and re-add the bot to the group.

Now we can create a `bot-config.yml` file. You can rename the `bot-config.yml.example` to `bot-config.yml` and edit this. All values in this file are lower case.

At the top level are the character names from OpenCharacters. Each of these has a `bot_token`, a list of `chat_ids` and `greeting_message` value. Add entries for each character.

Chat id can be found by sending a message to the bot in Telegram, then opening: https://api.telegram.org/bot<BOT_TOKEN>/getUpdates

```yml
---
char_name1:
  bot_token: '0000000000:XXXXXXXYYYYYYZZZZZZZ'
    chat_ids:
    - '-9012345678'
    - '101234567890'
  greeting_message: 'I am char_name1. How can help you with your queries.'
```

Next add the custom javascript to the character's advanced options custom js code. You can find the code in the file custom.js. Copy and paste the contents of the custom.js into the "Custom JavaScript code" field. This code can sit alongside any other custom code you have set up.  Currently importing in the form `await import("./plugins/telegram/custom.js")` does not work.

Next is the character name, this **must match the chat id (including leading hyphen '-' if present).** This is how the plugin knows which OpenCharacters character chat to process the messages.

Start the Telegram integration server process with the following command. Ensure you are in the plugins/telegram folder. 

    npm start

You should now see the server process listening on port 3000 on 127.0.0.1.

For development purposes the web server launched by node (express) is also configured to serve the OpenCharacter files (index.html and utils.js) from the main folder. So you can load a local version of OpenCharacters from `http://127.0.0.1:3000` if you wish.

# Usage

Once the server is running and the custom Javascript installed to the character's custom code you should be able to interact with the bot via Telegram.

For the integration to work the OpenCharacters page *needs* to be loaded and ensure you have selected the correct character. If you are setting up multiple bot integrations you will need to open multiple browser windows and have them each open.

Sending a message to the bot via Telegram, you should see the message being logged in the integration server console and then all going good it should appear in the OpenCharacters chat window. When the character responds this message will then be sent back to the Telegram chat. 

# Contributing

If you'd like to contribute to the project, feel free to fork the repository and submit a pull request. We welcome all contributions!

That should provide all the necessary information for setting up a Telegram bot and integrating it with the OpenCharacters plugin. Let me know if you have any further questions or if there's anything else you'd like me to include.
