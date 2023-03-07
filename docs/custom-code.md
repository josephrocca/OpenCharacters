If you open the advanced options in the character creation area then you'll see the "custom code" input. This allows you to define some JavaScript functions that extend the functionality of your character.

Some examples of what you can do with this:

 * Give your character access to the internet
 * Give your character the ability to create pictures using Stable Diffusion
 * Auto-delete/retry messages from your character that contain certain keywords

Here's how it works: You define an `async` function called `processMessages` that accepts a single input: `messages`, which is an array that looks like this:
```json5
[
  {
    "id": 0,
    "author": "user",
    "content": "Hello",
  },
  {
    "id": 1,
    "author": "ai",
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

The function is executed securely (i.e. in a sandboxed iframe), so if you're using a character that was created by someone else (and that has some custom code), then their code won't be able to access your OpenAI API key, or your messages with other characters, for example. The `processMessages` function only has access to the `messages` array for your current conversation.
