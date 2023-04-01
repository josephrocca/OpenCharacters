If you open the advanced options in the character creation area then you'll see the "custom code" input. This allows you to define some JavaScript functions that extend the functionality of your character.

Some examples of what you can do with this:

 * Give your character access to the internet (e.g. so you can ask it to summarise webpages)
 * Improve your character's memory by setting up an embedding/retrieval system (see "Storing Data" section below) 
 * Give your character a custom voice using an API like [ElevenLabs](https://api.elevenlabs.io/docs)
 * Allow your character to run custom JS or [Python](https://github.com/pyodide/pyodide/) code
 * Give your character the ability to create pictures using Stable Diffusion
 * Auto-delete/retry messages from your character that contain certain keywords


## Examples

After reading this doc to get a sense of the basics, visit this page for more complex, "real-world" examples: [custom-code-examples.md](https://github.com/josephrocca/OpenCharacters/blob/main/docs/custom-code-examples.md)

## The `oc` Object

Within your custom code, you can access and update `oc.thread.messages`. It's an array that looks like this:
```json5
[
  {
    "author": "user",
    "hiddenFrom": [], // can contain "user" and/or "ai"
    "content": "Hello",
  },
  {
    "author": "ai",
    "hiddenFrom": [],
    "content": "Hello, how can I help you today?",
  }
]
```
The most recent message is at the bottom. The `author` field can be `user`, `ai`, or `system`. Use "system" for guiding the AI's behavior, and including context/info where it wouldn't make sense to have that context/info come from the user or the AI.

Here's an example that replaces `:)` with `૮ ˶ᵔ ᵕ ᵔ˶ ა` in every message that is added to the thread:
```js
oc.thread.on("MessageAdded", function() {
  let m = oc.thread.messages.at(-1); // get most recent message
  m.content = m.content.replaceAll(":)", "૮ ˶ᵔ ᵕ ᵔ˶ ა");
});
```
You can edit existing messages like in this example, and you can also delete them, or add new ones.

You can also access and edit character data via `oc.character.propertyName`. Here are the property names that you can access and edit:

 * name
 * avatarUrl
 * roleInstruction
 * reminderMessage
 * initialMessages
 * customCode
 * temperature
 * topP
 * frequencyPenalty
 * presencePenalty
 * stopSequences
 * modelName

Yes, a character can even edit its own custom code!

Note that currently only the `temperature` setting is available in the character editor, so if you e.g. wanted to add a stop sequence for your character so it stops whenever it writes ":)" and also set presence pentalty to 1, then you could do it by adding this text to the custom code text box in the character editor:
```js
oc.character.stopSequences = [":)"];
oc.character.presencePenalty = 1;
```

Here's some custom code which allows the AI to see the contents of webpages if you put URLs in your messages:

```js
oc.thread.on("MessageAdded", async function () {
  let messages = oc.thread.messages;
  let lastMessage = messages.at(-1);
  if(lastMessage.author === "user") {
    let urlsInLastMessage = [...lastMessage.content.matchAll(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g)].map(m => m[0]);
    if(urlsInLastMessage.length === 0) return messages;
    // just grab contents for last URL
    let html = await fetch(urlsInLastMessage.at(-1)).then(r => r.text());
    let doc = new DOMParser().parseFromString(html, "text/html");
    let text = [...doc.querySelectorAll("h1,h2,h3,h4,p,pre")].map(el => el.textContent).join("\n");
    text = text.slice(0, 1000); // only grab first 1000 characters
    messages.push({
      author: "system",
      hiddenFrom: ["user"], // hide the message from user so it doesn't get in the way of the conversation
      content: "Here's the content of the webpage that was linked in the previous message: \n\n"+text,
    });
  }
});
```

Custom code is executed securely (i.e. in a sandboxed iframe), so if you're using a character that was created by someone else (and that has some custom code), then their code won't be able to access your OpenAI API key, or your messages with other characters, for example. The custom code only has access to the character data and the messages for your current conversation.

Here's some custom code that adds a `/name` command that changes the name of the character. It intercepts the user messages, and if it begins with `/name`, then it changes `oc.character.name` to whatever comes after `/name`, and then deletes the message.
```js
oc.thread.on("MessageAdded", async function () {
  let m = oc.thread.messages.at(-1); // most recent message
  if(m.author === "user" && m.content.startsWith("/name ")) {
    oc.character.name = m.content.replace(/^\/name /, "");
    oc.thread.messages.pop(); // remove the message
  }
});
```

### Visual Display and User Inputs

Your custom code runs inside an iframe. You can visually display the iframe using `oc.window.show()` (and hide with `oc.window.hide()`). The user can drag the embed around on the page and resize it. All your custom code is running within the iframe embed whether it's currently displayed or not. You can display content in the embed by just executing custom code like `document.body.innerHTML = "hello world"`.

You can use the embed to e.g. display a dynamic video/gif avatar for your character that changes depending on the emotion that is evident in the characters messages. Or to e.g. display the result of the p5.js code that the character is helping you write. And so on.

### Using the GPT API in Your Custom Code

You may want to use GPT/LLM APIs in your message processing code. For example, you may want to classify the sentiment of a message in order to display the correct avatar (see "Visual Display ..." section), or you may want to implement your own custom chat-summarization system, for example. In this case, you can use `oc.getChatCompletion`.

Use it like this:
```js
let result = await oc.getChatCompletion({
  messages: [{author:"system", content:"..."},{author:"user", content:"..."}, {author:"ai", content:"..."}, ...],
  temperature: 1,
  stopSequences: ["\n"],
  ...
});
```
The `messages` parameter is the only required one.

Here's an example of some custom code that edits all messages to include more emojis:

```js
oc.thread.on("MessageAdded", async function() {
  let lastMessage = oc.thread.messages.at(-1);
  let result = await oc.getChatCompletion({
    messages: [{author:"user", content:`Please edit the following message to have more emojis:\n\n---\n${lastMessage.content}\n---\n\nReply with only the above message (the content between ---), but with more (relevant) emojis.`}],
  });
  lastMessage.content = result.trim().replace(/^---|---$/g, "").trim();
});
```

## Storing Data (not yet implemented! open an issue if you want it)

If you'd like to save some data that is generated by your custom code, then you can do that by using the special `oc.thread.storage` and `oc.character.storage` objects. The `oc.character.storage` data will be available in all threads that use this character, whereas the `oc.thread.storage` will only be available within this thread. Just use `oc.character.storage` and `oc.thread.storage` like as if they're regular JS objects (`oc.thread.storage.foo = 10`), and the data will be automatically persisted until the user deletes the character or thread, respectively.
