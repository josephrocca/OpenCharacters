# Initial Messages
Initial messages are great for helping the AI get into character. The format of the initial messages (explained in this document) allows you to:

* **Hide inital messages from the user**: For example, you might have have many messages that would be annoying for the user to see every time they start a new conversation with the character.
* **Hide inital messages from the AI**: To, for example, provide user instructions or character creator credit/attribution at the top of the chat - stuff you want the user to see, but not the AI.
* **Create system messages**: These are used to guide the behavior of the AI, or provide information/context in situations where it wouldn't make sense for the AI or the user to "say" it.

Initial messages should follow the following format:
```
[AI]: This is the first AI message.
[USER]: This is the user's response.
[AI]: This is the second AI message.
[SYSTEM]: Here's a system message. Use system messages to help guide the AI.
```
You can hide messages from the `ai` or the `user` like this:
```
[AI; hiddenFrom=user]: This message is hidden from the user
```
Messages can be multi-line. For example, this is valid:
```
[AI]: This is the first AI message.
It has two lines.
[USER]: This is the user's response.
It also has two lines.
```
As with all messages, you can include markdown/HTML. Here's an example of an initial message the provides instructions to the user, and has an image embedded:
```
[SYSTEM, hiddenFrom=ai]: Hello there! Thanks for trying out my character. Here are some tips:
* Make sure to edit the character's response if they break character. You'll probably only have to do this for the first few messages, at most.
* ...
<img src="https://https://i.imgur.com/TFA2Nmx.jpg">
See the latest versions of my characters at my twitter account: [@exampleusername](https://twitter.com/exampleusername)
```
