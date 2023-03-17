# Append image based on the emotion of the message

This example adds an image/GIF to each message to visually display the emotion of the character, like in **[this example character][append emotion images nick wilde]**:

<img src="https://user-images.githubusercontent.com/1167575/225869887-03c450ec-b10a-4b81-9bbc-90a9eb928232.png" height="400">

In the code below:

* `oc.thread.on("MessageAdded", ...)` is used to trigger the code
* `oc.getChatCompletion` is used to classify the messages that are added into one of the emotions that you've given
* `<!--hidden-from-ai-start-->...<!--hidden-from-ai-end-->` is used to hide the appended images from the AI, so it doesn't get confused and start trying to make up its own image URLs based on the pattern that it observes in previous messages

You can replace the `<emotion>: <url>` list with your own.

```js
let emotions = `

neutral, happy: https://i.imgur.com/gPaq8YS.jpeg
horrified, shocked: https://i.imgur.com/aoDL1QP.jpeg
drunk: https://i.imgur.com/anoE7tj.jpeg
wistful, dreamy: https://i.imgur.com/dMcGtOA.jpeg
gross, disgusted, eww: https://i.imgur.com/F7NYSk0.jpeg
confident: https://i.imgur.com/KQS54ET.jpeg
beaming, proud of self, happy and alert: https://i.imgur.com/Y3NBEr4.jpeg
sorry, apologetic: https://i.imgur.com/5d8qxBd.jpeg
angry: https://i.imgur.com/51jbvuM.jpeg
sly, "hint hint": https://i.imgur.com/Mpt4UIt.jpeg
concerned: https://i.imgur.com/rYFlBDd.jpeg
sly grin: https://i.imgur.com/EGDfzaN.jpeg
worried, scared: https://i.imgur.com/5rp01eP.jpeg
concerned: https://i.imgur.com/V4Y3jUh.jpeg
disbelief: https://i.imgur.com/D05qdJ5.jpeg
happy, optimistic: https://i.imgur.com/B6tWeLV.jpeg
surprised, like "uhh what?!": https://i.imgur.com/Ra5Pb4c.jpeg
caught red handed: https://i.imgur.com/fvfw0Lc.jpeg
cool, dismissive: https://i.imgur.com/Z38xuvY.jpeg
patronising, teacherly: https://i.imgur.com/Tq1gKKw.jpeg
charming, sexy eyes: https://i.imgur.com/ny6HoRC.jpeg
disappointed: https://i.imgur.com/vxhjb6U.jpeg
disapproving face: https://i.imgur.com/x5XiOgv.jpeg
wacky, crazy, fun: https://i.imgur.com/9Q2osAe.jpeg
woops: https://i.imgur.com/CwYTcDO.jpeg
sucking up to someone: https://i.imgur.com/FkwJs8X.jpeg
sly: https://i.imgur.com/2Tcw7DO.jpeg
staring blankly: https://i.imgur.com/JSMx8EW.jpeg

`.trim().split("\n").map(l => [l.trim().split(":")[0].trim(), l.trim().split(":").slice(1).join(":").trim()]).map(a => ({label:a[0], url:a[1]}));

let numMessagesInContext = 4; // <-- how many historical messages to give it when classifying the latest message

oc.thread.on("MessageAdded", async function() {
  let lastMessage = oc.thread.messages.at(-1);
  if(lastMessage.author !== "ai") return;

  let questionText = `I'm about to ask you to classify the emotion of a particular message, but here's some context first:

---
${oc.thread.messages.slice(-numMessagesInContext).filter(m => m.role!=="system").map(m => (m.author=="ai" ? `[${oc.character.name}]: ` : `[Anon]: `)+m.content).join("\n\n")}
---

Okay, now that you have the context, please classify the emotion/mood of the following text:

---
${lastMessage.content}
---

Choose between the following categories:

${emotions.map((e, i) => `${i}) ${e.label}`).join("\n")}

Please respond with a SINGLE NUMBER (just the number, no other text) which corresponds to the emotion that most accurately matches the given message.`;

console.log("questionText:", questionText);

  let response = await oc.getChatCompletion({
    messages: [
      {author:"system", content:"You are a helpful assistant that classifies the emotion of particular text messages."},
      {author:"user", content:questionText},
    ],
  });
  let index = parseInt(response.split(")")[0].replace(/[^0-9]/g, ""));
  let emotionObj = emotions[index];
  console.log(response, emotionObj);
  let image = `<img style="height:70px;" src="${emotionObj.url}" title="${emotionObj.label.replace(/[^a-zA-Z0-9_\- ]/g, "")}">`
  lastMessage.content += `<!--hidden-from-ai-start--><br>${image}<!--hidden-from-ai-end-->`;
});

```


[append emotion images nick wilde]: https://tinyurl.com/274w9j5b
