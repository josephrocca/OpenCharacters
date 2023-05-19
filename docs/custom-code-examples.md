# Add a "refinement" step to the messages that your character generates

After your character generates a message, the message will be edited by GPT according to your instructions. Just edit the "include more emojis..." instruction text to something else, and then paste this script in the custom code input box of the advanced character options.

```js
oc.thread.on("MessageAdded", async function() {
  let lastMessage = oc.thread.messages.at(-1);
  if(lastMessage.author !== "ai") return; // only edit AI messages
  
let instruction = `

Here's a message:
---
${lastMessage.content}
---
Please rewrite this message to include more emojis. Respond with only the rewritten message - nothing more, nothing less.

`.trim();

  let response = await oc.getChatCompletion({
    messages: [
      {author:"system", content:"You are a helpful message editing assistant. You edit messages according the the user's instruction, and you respond with only the edited/modified message - nothing more, nothing less."},
      {author:"user", content:instruction},
    ],
  });
  lastMessage.content = response;
});
```

# Prevent character from taking actions on behalf of you during roleplaying
```js
oc.thread.on("MessageAdded", async function () {
  let lastMessage = oc.thread.messages.at(-1);

  if(lastMessage.author === "ai") {
    let result = await oc.getChatCompletion({
      messages: [
        {
          author: "user",
          content: `Please edit the following message so that it only contains actions taken by ${lastMessage.name} and not by ${oc.thread.userCharacter.name} or any other characters. Remove actions from characters other than ${lastMessage.name} in this message:\n\n---\n${lastMessage.content}\n---\n\nReply with the edited version of the above message which only includes ${lastMessage.name}'s first action/speech/etc. Your reply must not include follow-on actions by other characters.`,
        },
      ],
    });
    lastMessage.content = result.trim().replace(/^---|---$/g, "").trim();
  }
});
```

# Append image based on predicted facial expression of the message

This example adds an image/GIF to each message to visually display the facial expression of the character, like in **[this example character][append facial expression image nick wilde]**:

<img src="https://user-images.githubusercontent.com/1167575/225869887-03c450ec-b10a-4b81-9bbc-90a9eb928232.png" height="400">

In the code below:

* `oc.thread.on("MessageAdded", ...)` is used to trigger the code
* `oc.getChatCompletion` is used to classify the messages that are added into one of the facial expressions that you've given
* `<!--hidden-from-ai-start-->...<!--hidden-from-ai-end-->` is used to hide the appended images from the AI, so it doesn't get confused and start trying to make up its own image URLs based on the pattern that it observes in previous messages. **Edit**: There now exists the [`oc.messageRenderingPipeline`](https://github.com/josephrocca/OpenCharacters/blob/main/docs/custom-code.md) feature, which is probably a better approach for this sort of thing.

You can replace the `<expression>: <url>` list with your own.

```js
// Note: You can add multiple URLs for a single label and a random one will be selected.
// Separate urls with "|" like this:
// <expression>: https://example.com/image1.jpg | https://example.com/image2.jpg

let expressions = `


neutral, happy: https://i.imgur.com/gPaq8YS.jpeg
horrified, shocked: https://i.imgur.com/aoDL1QP.jpeg
drunk: https://i.imgur.com/anoE7tj.jpeg
wistful, dreamy: https://i.imgur.com/dMcGtOA.jpeg
gross, disgusted, eww: https://i.imgur.com/F7NYSk0.jpeg
confident: https://i.imgur.com/KQS54ET.jpeg
beaming, proud of self, happy and alert: https://i.imgur.com/Y3NBEr4.jpeg
sorry, apologetic: https://i.imgur.com/5d8qxBd.jpeg
angry: https://i.imgur.com/51jbvuM.jpeg
sly: https://i.imgur.com/2Tcw7DO.jpeg
sly, hint hint nudge nudge: https://i.imgur.com/Mpt4UIt.jpeg
relaxed confident grin: https://i.imgur.com/EGDfzaN.jpeg
concerned: https://i.imgur.com/rYFlBDd.jpeg
worried, scared: https://i.imgur.com/5rp01eP.jpeg
concerned: https://i.imgur.com/V4Y3jUh.jpeg
disbelief: https://i.imgur.com/D05qdJ5.jpeg
happy, optimistic: https://i.imgur.com/B6tWeLV.jpeg
very surprised, frozen, stunned: https://i.imgur.com/Ra5Pb4c.jpeg
caught red handed: https://i.imgur.com/fvfw0Lc.jpeg
cool, dismissive: https://i.imgur.com/Z38xuvY.jpeg
patronising, teacherly: https://i.imgur.com/Tq1gKKw.jpeg
charming, sexy eyes: https://i.imgur.com/ny6HoRC.jpeg
disappointed: https://i.imgur.com/vxhjb6U.jpeg
disapproving face: https://i.imgur.com/x5XiOgv.jpeg
wacky, crazy, fun: https://i.imgur.com/9Q2osAe.jpeg
woops: https://i.imgur.com/CwYTcDO.jpeg
sucking up to someone: https://i.imgur.com/FkwJs8X.jpeg
staring blankly: https://i.imgur.com/JSMx8EW.jpeg


`.trim().split("\n").map(l => [l.trim().split(":")[0].trim(), l.trim().split(":").slice(1).join(":").trim().split("|").map(url => url.trim())]).map(a => ({label:a[0], url:a[1]}));

let numMessagesInContext = 4; // <-- how many historical messages to give it when classifying the latest message

oc.thread.on("messageadded", async function() {
  let lastMessage = oc.thread.messages.at(-1);
  if(lastMessage.author !== "ai") return;

  let questionText = `I'm about to ask you to classify the facial expression of a particular message, but here's some context first:

---
${oc.thread.messages.slice(-numMessagesInContext).filter(m => m.role!=="system").map(m => (m.author=="ai" ? `[${oc.character.name}]: ` : `[Anon]: `)+m.content).join("\n\n")}
---

Okay, now that you have the context, please classify the facial expression of the following text:

---
${lastMessage.content}
---

Choose between the following categories:

${expressions.map((e, i) => `${i}) ${e.label}`).join("\n")}

Please respond with the number which corresponds to the facial expression that most accurately matches the given message. Respond with just the number - nothing else.`;

console.log("questionText:", questionText);

  let response = await oc.getChatCompletion({
    messages: [
      {author:"system", content:"You are a helpful assistant that classifies the hypothetical facial expression of particular text messages."},
      {author:"user", content:questionText},
    ],
  });
  let index = parseInt(response.split(")")[0].replace(/[^0-9]/g, ""));
  let expressionObj = expressions[index];
  let chosenUrl = expressionObj.url[Math.floor(Math.random()*expressionObj.url.length)]
  console.log(response, expressionObj, chosenUrl);
  let image = `<img style="height:70px;" src="${chosenUrl}" title="${expressionObj.label.replace(/[^a-zA-Z0-9_\- ]/g, "")}">`
  lastMessage.content += `<!--hidden-from-ai-start--><br>${image}<!--hidden-from-ai-end-->`;
});


```


# Randomly choose a character from a large, externally-hosted text file

There was a question on the Discord that asked how they could compile a list of thousands of characters, and then use some custom code to randomly choose a character when a user first opens **[the character share link](https://tinyurl.com/dthzwjb2)** and starts a conversation.

Here's some example code for this:
```js
// only choose a random character if we haven't already chosen one (as indicated by a filled-in role instruction). So if you want to re-roll a character, you can delete its instruction.
if(!oc.character.roleInstruction) {
  // download text file:
  let text = await fetch("https://gist.githubusercontent.com/josephrocca/93556a5a1483242b68790f58216e8ba9/raw/30a7e9d605488a4969f78fc665dde0009267870a/character-list.txt").then(r => r.text());
  // split into lines, and then split lines into "parts" (name, franchise, image url)
  let characters = text.trim().split("\n").map(line => line.split(";").map(part => part.trim()));
  // choose a random character
  let c = characters[Math.floor(characters.length*Math.random())];
  // set name and role instruction using the two parts
  oc.character.name = c[0];
  oc.character.roleInstruction = `You are ${c[0]} from the ${c[1]} franchise.`;
  oc.character.avatarUrl = c[2];
}
```
To create your own character list text file, you'll need to sign up for a Github account, and then click the "+" sign in the top right and click "Create gist...", then once you've created your "gist" (it's just a text file), click the "raw" button to get the direct URL to the text file. Then paste it in place of this example code, and then put that code in the "custom code" section.

Here's what the URL should look like: https://gist.githubusercontent.com/josephrocca/93556a5a1483242b68790f58216e8ba9/raw/30a7e9d605488a4969f78fc665dde0009267870a/character-list.txt

I.e. the URL should have `/raw/` in it, and it should lead to a plain text page (i.e. no "Github" header, or anything like that).

As you can see, the syntax/format of the text file is:
```
character name ; franchise ; avatar url
character name ; franchise ; avatar url
...
```

You can add more properties like:
```
character name ; franchise ; avatar url ; personality
character name ; franchise ; avatar url ; personality
...
```
And to reference `personality`, you'd use `${c[3]}` in the code. GPT-4 should be able to help you customise it if you paste the explanation that I've written here. You can also change anything else about the character with `oc.character.propertyNameYouWantToChange` - see here: https://github.com/josephrocca/OpenCharacters/blob/main/docs/custom-code.md

(BTW, the reason you'll want to sign up for Github is because it's one of the few places that you can create a simple text file that can be downloaded from another webpage. Normally the JS code on one page can't download some files from a different website due to a thing called "CORS". On top of this, Github is just really reputable and can be trusted to host your file forever. If you use some random pastebin type site there's a 100% chance you file will eventually either be deleted, or be redirected to some ad-filled embedded version. Github is hands-down the best place to host text files.)

# Give a character the ability to execute Python code

This example has its own doc: https://github.com/josephrocca/OpenCharacters/blob/main/docs/running-python-code.md

Also see the "starter character" called "Python Coder".

# Let your character see the contents of URLs that are in your messages

This will automatically download the content of any URLs that are in your messages, and put that content within a (hidden-from-user) message that the AI is able to see.

```js
async function getPdfText(data) {
  let doc = await window.pdfjsLib.getDocument({data}).promise;
  let pageTexts = Array.from({length: doc.numPages}, async (v,i) => {
    return (await (await doc.getPage(i+1)).getTextContent()).items.map(token => token.str).join('');
  });
  return (await Promise.all(pageTexts)).join(' ');
}
      
oc.thread.on("MessageAdded", async function ({message}) {
  if(message.author === "user") {
    let urlsInLastMessage = [...message.content.matchAll(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g)].map(m => m[0]);
    if(urlsInLastMessage.length === 0) return;
    if(!window.Readability) window.Readability = await import("https://esm.sh/@mozilla/readability@0.4.4?no-check").then(m => m.Readability);
    let url = urlsInLastMessage.at(-1); // we use the last URL in the message, if there are multiple
    let blob = await fetch(url).then(r => r.blob());
    let output;
    if(blob.type === "application/pdf") {
      if(!window.pdfjsLib) {
        window.pdfjsLib = await import("https://cdn.jsdelivr.net/npm/pdfjs-dist@3.6.172/+esm").then(m => m.default);
        pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdn.jsdelivr.net/npm/pdfjs-dist@3.6.172/build/pdf.worker.min.js";
      }
      let text = await getPdfText(await blob.arrayBuffer());
      output = text.slice(0, 5000); // <-- grab only the first 5000 characters (you can change this)
    } else {
      let html = await blob.text();
      let doc = new DOMParser().parseFromString(html, "text/html");
      let article = new Readability(doc).parse();
      output = `# ${article.title || "(no page title)"}\n\n${article.textContent}`;
      output = output.slice(0, 5000); // <-- grab only the first 5000 characters (you can change this)
    }
    oc.thread.messages.push({
      author: "system",
      hiddenFrom: ["user"], // hide the message from user so it doesn't get in the way of the conversation
      content: "Here's the content of the webpage that was linked in the previous message: \n\n"+output,
    });
  }
});
```

# Allow a character to update its own personality/reminder

After your character generates a message, the message will be used GPT to update the character's `reminderMessage`. You can edit the prompt text to your liking, and then paste this script in the custom code input box of the advanced character options.
```js
oc.thread.on("MessageAdded", async function() {
  let lastMessage = oc.thread.messages.at(-1);
  if(lastMessage.author !== "ai") return; // only run this code on AI messages
  let [ nonEditablePart, editablePart ] = oc.character.reminderMessage.split("---").map(text => text.trim());
let instruction = `

Here's a character's current personality and/or emotional state:
---
${editablePart}
---
Here's a message that this character just wrote:
---
${oc.character.name}: ${lastMessage.content}
---
Please rewrite the personality text to take into account their latest message. Respond with only the rewritten personality - nothing more, nothing less. If nothing about their personality changed, just respond verbatim with exactly the same text as the existing personality.

`.trim();

  let response = await oc.getChatCompletion({
    messages: [
      {author:"system", content:"You are a helpful editing assistant. You text messages according the the user's instruction, and you respond with only the edited/modified message - nothing more, nothing less."},
      {author:"user", content:instruction},
    ],
  });

  oc.character.reminderMessage = nonEditablePart + "\n---\n" + response.trim();
});
```
For the above code to work, your reminder message should be structured with a `---` between the non-editable and editable stuff, like this:
```
Your regular reminder message content.
---
The character's self-editable stuff.
```

# Give you character a voice

See the code for the text-to-speech plugin: https://github.com/josephrocca/OpenCharacters/blob/main/plugins/tts/main.js

# Allow your character to edit its own settings

See the starter character called "Fire Alarm Bot".

[append facial expression image nick wilde]: https://tinyurl.com/3767xprx
