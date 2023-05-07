![banner](https://user-images.githubusercontent.com/1167575/225629372-eb4de08a-ed62-4660-a83d-6e42a5c092d7.jpg)


<p align="center">Similar to CharacterAI, but open source, and with much deeper character customization.</p>

<p align="center"><b>⟶ <a href="https://josephrocca.github.io/OpenCharacters">Try it!</a> ⟵</b></p>

<p align="center"><a href="https://discord.gg/5tkWXJFqPV">Discord Server</a></p>

## Features:
* The whole web app is a single HTML file - no server (serve it [locally](https://github.com/josephrocca/OpenCharacters/blob/main/docs/local-setup.md) if you want).
* All your data is stored in your browser's local storage (again, there is no server).
* Share characters with a link - all character data is embedded within the link.
* Auto-summarization algorithm (for old messages) which extends effective character memory/context size massively.
* Characters automatically compress messages into 'memories' and retrieve relevant memories based on context (currently in beta, enable in advanced options). You can manually add memories and use them like "lorebook" entries. Can handle as many memories as you need - tens of thousands or more.
* Fully extensible with [custom code](https://github.com/josephrocca/OpenCharacters/blob/main/docs/custom-code.md). See examples [here](https://github.com/josephrocca/OpenCharacters/blob/main/docs/custom-code-examples.md).
  * Give your character access to the internet
  * Create your own slash commands
  * Give your character a video avatar (custom code has its own iframe & can display arbitrary content)
  * Create a "game master" [with a separate AI-powered process](https://tinyurl.com/5t3x8pdk) that tracks your abilities, inventory, etc.
  * Create your own memory structures (embedding, retrieval, etc.)
  * Give your character an internal thought process that runs alongside the chat
  * Give your character a voice via the browser's built-in TTS, or via an external API like ElevenLabs
  * Characters can [edit their own personality and custom code](https://tinyurl.com/4ccnn9zb) - self-improving and change over time
  * Allow your character to execute [Python](https://github.com/josephrocca/OpenCharacters/blob/main/docs/running-python-code.md) or JavaScript code.
* Currently supports OpenAI APIs [and most Hugging Face models](https://github.com/josephrocca/OpenCharacters/blob/main/docs/custom-models.md).
* Easily import character files and conversation data most other formats.
* Send new feature ideas or bug reports [here](https://github.com/josephrocca/OpenCharacters/issues) or on our [Discord server](https://discord.gg/5tkWXJFqPV).

## Changelog

Please see the `#announcements` channel on the [Discord server](https://discord.gg/5tkWXJFqPV) for latest updates.
