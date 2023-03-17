# Append image based on predicted facial expression of the message

This example adds an image/GIF to each message to visually display the facial expression of the character, like in **[this example character][append facial expression image nick wilde]**:

<img src="https://user-images.githubusercontent.com/1167575/225869887-03c450ec-b10a-4b81-9bbc-90a9eb928232.png" height="400">

In the code below:

* `oc.thread.on("MessageAdded", ...)` is used to trigger the code
* `oc.getChatCompletion` is used to classify the messages that are added into one of the facial expressions that you've given
* `<!--hidden-from-ai-start-->...<!--hidden-from-ai-end-->` is used to hide the appended images from the AI, so it doesn't get confused and start trying to make up its own image URLs based on the pattern that it observes in previous messages

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
concerned: https://i.imgur.com/rYFlBDd.jpeg
sly grin: https://i.imgur.com/EGDfzaN.jpeg
very worried, scared, "ahhh!": https://i.imgur.com/5rp01eP.jpeg
concerned: https://i.imgur.com/V4Y3jUh.jpeg
disbelief: https://i.imgur.com/D05qdJ5.jpeg
happy, optimistic, eager: https://i.imgur.com/B6tWeLV.jpeg
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


[append facial expression image nick wilde]: https://tinyurl.com/3767xprx
