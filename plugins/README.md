OpenCharacters allows you to add [custom code](https://github.com/josephrocca/OpenCharacters/blob/main/docs/custom-code.md) to your characters. This allows you to extend your characters with functionality that goes far beyond what is provided by default.

Anyone can add custom code to their character - simply open up the advanced options in the character creation dialog and add some code. However, not everyone knows how to code, and there are a bunch of common features which people request which aren't available by default.

So this page lists some "official" custom code "plugins" which you can enable by simply pasting some text into the custom code input box of your character.

## Text-to-Speech
This causes your character to "speak" the text that it generates. To use it, just open the advanced character settings and paste this on a new line in the custom code box:
```
import "./plugins/tts/main.js";
```
