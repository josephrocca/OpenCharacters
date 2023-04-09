# Instruction/Role and Reminder Messages
The instruction message is placed at the beginning of the messages, and is never summarized. It'll always be there are the start of the messages that are sent to the AI, no matter how long the chat thread becomes. This is *unlike* [initial messages](https://github.com/josephrocca/OpenCharacters/blob/main/docs/initial-messages.md), which are just treated as normal messages - they'll get summarized if the thread gets long enough.

Same with the reminder message - it'll always be placed at the end of the chat thread, such that it's the last/most-recent message that the AI sees when it's generating its response. It's always dynamically 'slipped in' at the end of the messages before asking for the AI response - it is never summarized.

Again, all "normal" messages (*including* 'initial messages') will eventually get summarized if the thread gets long enough, assuming you've got summarization enabled in the character settings.

Also, when you edit a character's instruction/role and reminder messages, all *existing* threads will immediately receive the new updates. This is because the instruction and reminder messages are 'properties' of *the character*, not the chat threads that you're chatting to the character with.

## Advanced Instruction Messages
You can actually add multiple instruction/role messages and reminder messages. Just use the same format that's used for initial messages. You can use multiple instruction/role messages as a way to add 'initial messages' that are never summarized away - i.e. messages that are always placed at the start of the thread. And you can *change the author* of these messages from the default 'SYSTEM', to e.g. the 'AI', or 'USER', or any combination of those.

Here's an example of some text that you could write in the instruction/role input box that 'characterizes'/instructs the character using a first-person message:
```
[AI]: I'm a dragon.
[USER]: I'm the queen of kingdom that is near the dragon's lair.
[SYSTEM]: What follows is a story about the queen and the dragon.
```
(Please be more creative than this 😅 I'm just hastily writing documentation here.)

As you can see, this is just like [initial messages](https://github.com/josephrocca/OpenCharacters/blob/main/docs/initial-messages.md), except these messages will never get summarized. They'll always remain at the start of the chat.

Note that, normally, you'd just write something like this in the instruction/role input box:

```
You are a dragon. The user is the queen of kingdom that is near the dragon's lair. What follows is a story about the queen and the dragon.
```

That's actually exactly equivalent to writing this:

```
[SYSTEM]: You are a dragon. The user is the queen of kingdom that is near the dragon's lair. What follows is a story about the queen and the dragon.
```

So you can see that by default the instruction/role is 'spoken' by the 'system'. Using this 'advanced' approach you can create instructions which mix all messages types (user, ai, system).

## Advanced Reminder Messages
All of the above applies for reminder messages too. For example, below we set a first-person reminder message - i.e. we make the AI remind itself. This is useful to prevent the AI from "replying" to the reminder message.
```
[AI]: (Thought: I need to remember to be very descriptive, and create an engaging experience for the user)
```
If you didn't include the `[AI]: ` part at the start, then it'd just be a 'normal' reminder message, and would be 'spoken' by 'SYSTEM'.

Notice that I put "Thought:" at the start of the message and wrapped it in parentheses. I could have also used `(OOC: ...)`, which mean "out of character", or something like that. That way the message doesn't get treated like it's part of the actual conversation.

And you can of course add as many reminder messages as you like using this `[AI]:`/`[USER]:`/`[SYSTEM]:` format. Just follow the examples above, and in the [initial messages](https://github.com/josephrocca/OpenCharacters/blob/main/docs/initial-messages.md) doc.
