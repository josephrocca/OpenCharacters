// work around Chrome bug:
while(speechSynthesis.getVoices().length === 0) {
  await new Promise(r => setTimeout(r, 10));
}

let availableVoiceNames = speechSynthesis.getVoices().map(v => v.name).sort((a,b) => a.toLowerCase().includes("english") ? -1 : 1);
window.chosenVoiceName = availableVoiceNames[0];

document.body.innerHTML = `
  Please choose a voice:
  <br>
  <select onchange="window.chosenVoiceName=this.value;">${availableVoiceNames.map(n => `<option>${n}</option>`).join("")}</select>
  <br>
  <button onclick="oc.window.hide();">submit</button>
  <br><br>
  (As you can see, this plugin is pretty rudimentary for now. Feel free to ask for more features on the Discord.)
`;

oc.window.show();

let sentence = "";
oc.thread.on("StreamingMessage", async function (data) {
  for await (let chunk of data.chunks) {
    sentence += chunk.text;
    let endOfSentenceIndex = Math.max(sentence.indexOf("."), sentence.indexOf("!"), sentence.indexOf("?"));
    if(endOfSentenceIndex !== -1) {
      console.log("Speaking sentence:", sentence);
      await textToSpeech({text:sentence.slice(0, endOfSentenceIndex+1), voiceName:window.chosenVoiceName});
      sentence = sentence.slice(endOfSentenceIndex+1);
      sentence = sentence.replace(/^[.!?\s]+/g, "");
    }
  }
});

function textToSpeech({text, voiceName}) {
  return new Promise((resolve, reject) => {
    const voices = speechSynthesis.getVoices();
    const voice = voices.find(v => v.name === voiceName);
    const utterance = new SpeechSynthesisUtterance();
    utterance.text = text;
    utterance.voice = voice;
    utterance.rate = 1.2;
    utterance.pitch = 1.0;
    utterance.onend = function() {
      resolve();
    };
    utterance.onerror = function(e) {
      reject(e);
    };
    speechSynthesis.speak(utterance);
  });
}
