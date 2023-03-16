# OpenCharacters
Simple little web interface for creating characters and chatting with them. It's basically a single HTML file - no server. Share characters using a link (character data is stored within the URL itself). All chat data is stored in your browser using IndexedDB. Currently only supports OpenAI APIs, but can add more later.

**Try it here:** https://josephrocca.github.io/OpenCharacters

**Discord:** https://discord.gg/5tkWXJFqPV

* You can get characters to chat with one another using the "reply with..." button (and you can enable text-to-speech to hear the characters converse)
* You can share characters with a link - all character data is stored within the URL itself (again, there's no server, this whole project is just a one big HTML file)
* You can give characters a [custom "message re-writing" functions](https://github.com/josephrocca/OpenCharacters/blob/main/docs/custom-code.md) so they can e.g. get access to the internet, or to a Stable Diffusion API, etc.
* Characters can [edit themselves](https://github.com/josephrocca/OpenCharacters/blob/main/docs/custom-code.md) so e.g. their personality can change over time
* Auto-summarization algorithm (for old messages) which extends 'effective' context massively
* Send new feature ideas or bug reports [here](https://github.com/josephrocca/OpenCharacters/issues)

## Video Demo

Here's a video demo of two bots chatting with one another:

https://user-images.githubusercontent.com/1167575/223195801-2eb9b417-a868-422f-aa76-942571e31a7e.mp4

