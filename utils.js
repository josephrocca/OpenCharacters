export const $$ = (selector) => document.querySelectorAll(selector);

// add a proxy to $ that captures function calls and has a getter for ids:
export const $ = new Proxy(function(){}, {
  get: (target, prop) => {
    if(/^[a-zA-Z0-9]+$/.test(prop)) {
      return document.querySelector(`#${prop}`);
    }
  },
  apply: (target, thisArg, args) => {
    return document.querySelector(args[0]);
  }
});

export const showEl = (el) => {
  if(el.style.display !== 'none') return;
  el.style.display = el.dataset.originalDisplayValue || '';
};
export const hideEl = (el) => {
  if(el.style.display === 'none') return;
  el.dataset.originalDisplayValue = el.style.display;
  el.style.display = 'none';
};

export const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function prompt2(specs, opts={}) {

  if(!opts.backgroundColor) opts.backgroundColor = getComputedStyle(document.body).getPropertyValue('--background');

  let ctn = document.createElement("div");
  let sections = "";
  let i = 0;
  for(let [key, spec] of Object.entries(specs)) {
    if(spec.type == "select") {
      sections += `
        <section data-initially-hidden="${spec.hidden === true ? "yes" : "no"}" style="${spec.hidden === true ? "display:none" : ""};">
          <div style="margin:0.5rem 0; margin-top:${i==0 ? 0 : 1}rem; font-size:85%;">${spec.label}</div>
          <div style="display:flex;">
            <div style="flex-grow:1;">
              <select data-spec-key="${sanitizeHtml(key)}" value="${sanitizeHtml(spec.defaultValue)}" style="width:100%;height:100%;background:${sanitizeHtml(opts.backgroundColor)}; padding:0.25rem;">${spec.options.map(o => `<option value="${sanitizeHtml(o.value)}" ${o.value === spec.defaultValue ? "selected" :""}>${sanitizeHtml(o.content) || sanitizeHtml(o.value)}</option>`).join("")}</select>
            </div>
          </div>
        </section>`;
    } else if(spec.type == "textLine") {
      sections += `
        <section data-initially-hidden="${spec.hidden === true ? "yes" : "no"}" style="${spec.hidden === true ? "display:none" : ""};">
          <div style="margin:0.5rem 0; margin-top:${i==0 ? 0 : 1}rem; font-size:85%;">${spec.label}</div>
          <div style="display:flex;">
            <div style="flex-grow:1;">
              <input data-spec-key="${sanitizeHtml(key)}" value="${sanitizeHtml(spec.defaultValue)}" style="width:100%;height:100%;background:${sanitizeHtml(opts.backgroundColor)}; border: 1px solid lightgrey; border-radius: 3px; padding: 0.25rem;" type="text" placeholder="${sanitizeHtml(spec.placeholder)}">
            </div>
          </div>
        </section>`;
    } else if(spec.type == "text") {
      sections += `
        <section data-initially-hidden="${spec.hidden === true ? "yes" : "no"}" style="${spec.hidden === true ? "display:none" : ""};">
          <div style="margin:0.5rem 0; margin-top:${i==0 ? 0 : 1}rem; font-size:85%;">${spec.label}</div>
          <div style="display:flex;">
            <div style="flex-grow:1;">
              <textarea data-spec-key="${sanitizeHtml(key)}" style="width:100%;height:100%;background:${sanitizeHtml(opts.backgroundColor)}; min-height:4rem; border: 1px solid lightgrey; border-radius: 3px;" type="text" placeholder="${sanitizeHtml(spec.placeholder)}">${sanitizeHtml(spec.defaultValue)}</textarea>
            </div>
          </div>
        </section>`;
    }
    i++;
  }
  ctn.innerHTML = `
    <div style="background:rgba(0,0,0,0.2); position:fixed; top:0; left:0; right:0; bottom:0; z-index:9999999; display:flex; justify-content:center; color:inherit; font:inherit;">
      <div class="sectionsContainer" style="width:400px; background:${sanitizeHtml(opts.backgroundColor)}; height: min-content; padding:1rem; border:1px solid #eaeaea; border-radius:3px; box-shadow: 0px 1px 10px 3px rgb(130 130 130 / 24%); margin-top:0.5rem; max-height: calc(100% - 1rem); overflow:auto;">
        ${sections}
        ${Object.values(specs).find(s => s.hidden === true) ? `
        <div style="text-align:center; margin-top:1rem; display:flex; justify-content:center;">
          <button class="showHidden" onclick="this.closest('.sectionsContainer').querySelectorAll('[data-initially-hidden=yes]').forEach(el => el.style.display=''); this.remove();" style="padding: 0.25rem;">${opts.showHiddenInputsText || "Show hidden inputs"}</button>
        </div>
        ` : ""}
        <div style="text-align:center; margin-top:1rem; display:flex; justify-content:space-between;">
          <button class="cancel" style="padding: 0.25rem;">Cancel</button>
          <button class="submit" style="padding: 0.25rem;">${opts.submitButtonText || "Submit"}</button>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(ctn);
  let values = await new Promise((resolve) => {
  ctn.querySelector("button.submit").onclick = () => {
    let values = {};
    for(let el of [...ctn.querySelectorAll("[data-spec-key]")]) {
      if(el.tagName === "INPUT") {
        if(el.type == "file") {
          values[el.dataset.specKey] = el.files;
        } else {
          values[el.dataset.specKey] = el.value;
        }
      } else if(el.tagName === "TEXTAREA") {
        values[el.dataset.specKey] = el.value;
      } else if(el.tagName === "SELECT") {
        values[el.dataset.specKey] = el.value;
      }
    }
    resolve(values);
  }
  ctn.querySelector("button.cancel").onclick = () => {
    resolve(null);
  }
   });
   ctn.remove();
   return values;
}


export function sanitizeHtml(text) {
  if(text === undefined) text = "";
  text = text+"";
  return text.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}




speechSynthesis.getVoices(); // this is needed to populate the list of voices in (some?) browsers

export function textToSpeech({text, voiceName}) {
  return new Promise((resolve, reject) => {
    const voices = speechSynthesis.getVoices();
    const voice = voices.find(v => v.name === voiceName);
    const utterance = new SpeechSynthesisUtterance();
    utterance.text = text;
    utterance.voice = voice;
    utterance.rate = 1.3;
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
