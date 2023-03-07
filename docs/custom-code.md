If you open the advanced options in the character creation area then you'll see the "custom code" input. This allows you to define some JavaScript functions that extend the functionality of your character.

Some examples of what you can do with this:

 * Give your character access to the internet (e.g. so you can ask it to summarise webpages)
 * Give your character the ability to create pictures using Stable Diffusion
 * Auto-delete/retry messages from your character that contain certain keywords

Here's how it works: You define an `async` function called `processMessages` that accepts a single input: `messages`, which is an array that looks like this:
```json5
[
  {
    "id": 0,
    "author": "user",
    "hidden": false,
    "content": "Hello",
  },
  {
    "id": 1,
    "author": "ai",
    "hidden": false,
    "content": "Hello, how can I help you today?",
  }
]
```
The most recent message is at the bottom.

Your `processMessages` function can alter messages, and add messages to this array, and then it should return that updated `messages` array.

The `processMessages` function is executed after *every* turn in the conversation. It 'sees' all the messages posted so far.

Below is a example of a `processMessages` function that you could put in the "custom code" text area of a character. This `processMessages` function simply replaces all instances of ":)" with "૮ ˶ᵔ ᵕ ᵔ˶ ა".

```js
async function processMessages(messages) {
  for(let m of messages) {
    m.content = m.content.replaceAll(":)", "૮ ˶ᵔ ᵕ ᵔ˶ ა");
  }
  return messages;
}
```

Here's one which allows the AI to see the contents of webpages if you put URLs in your messages:

```js
// note that you need to replace corsproxy.com with an actual cors proxy
async function processMessages(messages) {
  let lastMessage = messages.at(-1);
  if(lastMessage.author === "user") {
    let urlsInLastMessage = [...lastMessage.content.matchAll(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g)].map(m => m[0]);
    if(urlsInLastMessage.length === 0) return messages;
    // just grab contents for last URL
    let html = await fetch("https://corsproxy.com/?url="+encodeURIComponent(urlsInLastMessage.at(-1)).then(r => r.text()));
    let doc = new DOMParser().parseFromString(html, "text/html");
    let text = [...doc.querySelectorAll("h1,h2,h3,h4,p")].map(el => el.textContent).join("\n");
    text = text.slice(0, 1000); // only grab first 1000 characters
    messages.push({
      author: "user",
      collapsed: true, // hide the message so it doesn't get in the way of the conversation
      content: "I've copied the content of the webpage that I just linked: \n\n"+text,
    });
  } else {
    return messages;
  }
}
```

The function is executed securely (i.e. in a sandboxed iframe), so if you're using a character that was created by someone else (and that has some custom code), then their code won't be able to access your OpenAI API key, or your messages with other characters, for example. The `processMessages` function only has access to the `messages` array for your current conversation.
