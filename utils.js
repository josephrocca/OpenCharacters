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

  if(!opts.backgroundColor) opts.backgroundColor = prompt2.defaults.backgroundColor ?? getComputedStyle(document.body).getPropertyValue('background-color');
  if(!opts.borderColor) opts.borderColor = prompt2.defaults.borderColor ?? "#eaeaea";
  if(!opts.borderRadius) opts.borderRadius = prompt2.defaults.borderRadius ?? "3px";

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
              <select data-spec-key="${sanitizeHtml(key)}" value="${sanitizeHtml(spec.defaultValue)}" style="width:100%;height:100%; padding:0.25rem;">${spec.options.map(o => `<option value="${sanitizeHtml(o.value)}" ${o.value === spec.defaultValue ? "selected" :""}>${sanitizeHtml(o.content) || sanitizeHtml(o.value)}</option>`).join("")}</select>
            </div>
          </div>
        </section>`;
    } else if(spec.type == "textLine") {
      sections += `
        <section data-initially-hidden="${spec.hidden === true ? "yes" : "no"}" style="${spec.hidden === true ? "display:none" : ""};">
          <div style="margin:0.5rem 0; margin-top:${i==0 ? 0 : 1}rem; font-size:85%;">${spec.label}</div>
          <div style="display:flex;">
            <div style="flex-grow:1;">
              <input data-initial-focus="${spec.focus === true ? "yes" : "no"}" data-spec-key="${sanitizeHtml(key)}" value="${sanitizeHtml(spec.defaultValue)}" style="width:100%;height:100%; border: 1px solid lightgrey; border-radius: 3px; padding: 0.25rem;" type="text" placeholder="${sanitizeHtml(spec.placeholder)}" ${spec.validationPattern ? `pattern="${sanitizeHtml(spec.validationPattern)}"` : ""}>
            </div>
          </div>
        </section>`;
    } else if(spec.type == "text") {
      sections += `
        <section data-initially-hidden="${spec.hidden === true ? "yes" : "no"}" style="${spec.hidden === true ? "display:none" : ""};">
          <div style="margin:0.5rem 0; margin-top:${i==0 ? 0 : 1}rem; font-size:85%;">${spec.label}</div>
          <div style="display:flex;">
            <div style="flex-grow:1;">
              <textarea data-initial-focus="${spec.focus === true ? "yes" : "no"}" data-spec-key="${sanitizeHtml(key)}" ${spec.height === "fit-content" ? `data-height="fit-content"` : ``} style="width:100%; ${spec.height === "fit-content" ? "" : `height:${sanitizeHtml(spec.height)}`}; min-height:${spec.minHeight ?? "4rem"}; max-height:${spec.maxHeight ?? "50vh"}; border: 1px solid lightgrey; border-radius: 3px; ${spec.cssText || ""};" type="text" placeholder="${sanitizeHtml(spec.placeholder)}">${sanitizeHtml(spec.defaultValue)}</textarea>
            </div>
          </div>
        </section>`;
    }
    i++;
  }
  ctn.innerHTML = `
    <div class="promptModalInnerContainer" style="background:rgba(0,0,0,0.2); position:fixed; top:0; left:0; right:0; bottom:0; z-index:9999999; display:flex; justify-content:center; color:inherit; font:inherit; padding:0.5rem;">
      <div style="width:600px; background:${sanitizeHtml(opts.backgroundColor)}; height: min-content; padding:1rem; border:1px solid ${opts.borderColor}; border-radius:${opts.borderRadius}; box-shadow: 0px 1px 10px 3px rgb(130 130 130 / 24%); max-height: calc(100% - 1rem);display: flex; flex-direction: column;">
        <div class="sectionsContainer" style="overflow:auto;">
          ${sections}
          ${Object.values(specs).find(s => s.hidden === true) ? `
          <div style="text-align:center; margin-top:1rem; display:flex; justify-content:center;">
            <button class="showHidden" style="padding: 0.25rem;">${opts.showHiddenInputsText || "Show hidden inputs"}</button>
          </div>
          ` : ""}
        </div>
        <div style="text-align:center; margin-top:1rem; display:flex; justify-content:space-between;">
          <button class="cancel" style="padding: 0.25rem;">Cancel</button>
          <button class="submit" style="padding: 0.25rem;">${opts.submitButtonText || "Submit"}</button>
        </div>
      </div>
      <style>
        .promptModalInnerContainer .sectionsContainer input:invalid {
          background-color: lightpink;
        }
        .promptModalInnerContainer .sectionsContainer {
          -ms-overflow-style: none;  /* Internet Explorer 10+ */
          scrollbar-width: none;  /* Firefox */
        }
        .promptModalInnerContainer .sectionsContainer::-webkit-scrollbar { 
          display: none;  /* Safari and Chrome */
        }
        .promptModalInnerContainer .sectionsContainer.scrollFade {
          padding-bottom: 30px;
          -webkit-mask-image: linear-gradient(to bottom, black calc(100% - 30px), #ffffff00 100%);
          mask-image: linear-gradient(to bottom, black calc(100% - 30px), #ffffff00 100%);
        }
      </style>
    </div>
  `;
  document.body.appendChild(ctn);
  
  function updateFitHeights() { // settimeout to ensure rendered
    ctn.querySelectorAll("textarea[data-height=fit-content]").forEach(el => {
      let minHeight = el.offsetHeight; // textareas will always have min-height set, so we can use that via offsetHeight
      el.style.height = Math.max(minHeight, (el.scrollHeight+10)) + "px";
    });
  }

  setTimeout(updateFitHeights, 5);

  if(ctn.querySelector("button.showHidden")) {
    ctn.querySelector("button.showHidden").onclick = () => {
      ctn.querySelectorAll('.sectionsContainer [data-initially-hidden=yes]').forEach(el => el.style.display='');
      ctn.querySelector("button.showHidden").remove();
      updateFitHeights();
    };
  }

  setTimeout(() => {
    // add scrollFade if sectionsContainer has scroll
    let sectionsContainerEl = ctn.querySelector(".promptModalInnerContainer .sectionsContainer");
    if(sectionsContainerEl.scrollHeight > sectionsContainerEl.offsetHeight) {
      sectionsContainerEl.classList.add("scrollFade");
    }
    // focus
    let focusEl = ctn.querySelector(".promptModalInnerContainer .sectionsContainer [data-initial-focus=yes]");
    if(focusEl) {
      focusEl.focus();
      focusEl.selectionStart = focusEl.value.length;
    }
  }, 5);

  // a spec can have a `show` function which determines whether it's shown based on the values of the other inputs
  function updateInputVisibilies() {
    const values = getAllValues();
    for(const el of [...ctn.querySelectorAll("[data-spec-key]")]) {
      const showFn = specs[el.dataset.specKey].show;
      if(!showFn) continue;
      if(showFn(values)) {
        el.closest('section').style.display = "";
      } else {
        el.closest('section').style.display = "none";
      }
    }
  }
  updateInputVisibilies();
  for(const el of [...ctn.querySelectorAll("[data-spec-key]")]) {
    el.addEventListener("input", updateInputVisibilies);
  }

  function getAllValues() {
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
    return values;
  }

  let values = await new Promise((resolve) => {
    ctn.querySelector("button.submit").onclick = () => {
      let values = getAllValues();
      resolve(values);
    }
    ctn.querySelector("button.cancel").onclick = () => {
      resolve(null);
    }
  });
  ctn.remove();
  return values;
}


export function createFloatingWindow(opts={}) {

  if(!opts.backgroundColor) opts.backgroundColor = createFloatingWindow.defaults.backgroundColor ?? getComputedStyle(document.body).getPropertyValue('background-color');
  if(!opts.borderColor) opts.borderColor = createFloatingWindow.defaults.borderColor ?? "#eaeaea";
  if(!opts.borderRadius) opts.borderRadius = createFloatingWindow.defaults.borderRadius ?? "3px";
  if(!opts.initialWidth) opts.initialWidth = createFloatingWindow.defaults.initialWidth ?? 500;
  if(!opts.initialHeight) opts.initialHeight = createFloatingWindow.defaults.initialHeight ?? 300;

  // calculate centered `left` value based on initial width/height
  let left = Math.max(0, (window.innerWidth - opts.initialWidth) / 2);
  let top = 50;

  let tmp = document.createElement("div");
  tmp.innerHTML = `<div class="window" style="background-color:${opts.backgroundColor}; border:1px solid ${opts.borderColor}; border-radius:${opts.borderRadius}; width:${opts.initialWidth}px;height:${opts.initialHeight}px;z-index:999999999;position:fixed; top:${top}px; left:${left}px; box-shadow:0px 1px 10px 3px rgb(130 130 130 / 24%); display:flex; flex-direction:column;">
    <div class="header" style="user-select:none; cursor:move; border-bottom: 1px solid var(--border-color);display: flex;justify-content: space-between; padding:0.25rem;">
      <div>${opts.header || ""}</div>
      <div class="closeButton" style="min-width: 1.3rem; background: #9e9e9e; display: flex; justify-content: center; align-items: center; cursor: pointer; border-radius:${opts.borderRadius};">✖</div>
    </div>
    <div class="body" style="overflow:auto; width:100%; height:100%;">${opts.body || ""}</div>
    <div class="cornerResizeHandle" style="position:absolute; bottom:0; right:0; cursor:se-resize; user-select:none;width: 0; height: 0; border-style: solid; border-width: 0 0 10px 10px; border-color: transparent transparent #9e9e9e transparent;"></div>
  </div>
  `;
  let windowEl = tmp.firstElementChild;

  let headerEl = windowEl.querySelector(".header");
  let bodyEl = windowEl.querySelector(".body");
  let closeButtonEl = windowEl.querySelector(".closeButton");
  let cornerResizeHandle = windowEl.querySelector(".cornerResizeHandle");

  let mouseDown = false;
  let x = 0;
  let y = 0;
  headerEl.addEventListener("mousedown", (e) => {
    mouseDown = true;
    x = e.clientX;
    y = e.clientY;
  });
  document.documentElement.addEventListener("mouseup", () => {mouseDown=false; x=0; y=0;});
  document.documentElement.addEventListener('mouseleave', () => {mouseDown=false; x=0; y=0;});
  document.documentElement.addEventListener('contextmenu', () => {mouseDown=false; x=0; y=0;});
  document.documentElement.addEventListener('mousemove', (e) => {
    if(mouseDown) {
      let dx = e.clientX-x;
      let dy = e.clientY-y;
      windowEl.style.top = parseInt(windowEl.style.top) + dy + "px";
      windowEl.style.left = parseInt(windowEl.style.left) + dx + "px";
      x = e.clientX;
      y = e.clientY;
    }
  });
  // make windowEl resizable from the right-hand bottom corner (cornerResizeHandle element)
  // similar to above, but we alter width and height instead of top and left
  let mouseDown2 = false;
  let x2 = 0;
  let y2 = 0;
  cornerResizeHandle.addEventListener("mousedown", (e) => {
    mouseDown2 = true;
    x2 = e.clientX;
    y2 = e.clientY;
  });
  document.documentElement.addEventListener("mouseup", () => {mouseDown2=false; x2=0; y2=0;});
  document.documentElement.addEventListener('mouseleave', () => {mouseDown2=false; x2=0; y2=0;});
  document.documentElement.addEventListener('contextmenu', () => {mouseDown2=false; x2=0; y2=0;});
  document.documentElement.addEventListener('mousemove', (e) => {
    if(mouseDown2) {
      let dx = e.clientX-x2;
      let dy = e.clientY-y2;
      windowEl.style.height = parseInt(windowEl.style.height) + dy + "px";
      windowEl.style.width = parseInt(windowEl.style.width) + dx + "px";
      x2 = e.clientX;
      y2 = e.clientY;
    }
  });

  document.body.appendChild(windowEl);

  const api = {
    ctn: windowEl,
    headerEl,
    bodyEl,
    hide: function() {
      // we don't just display:none because IIUC that can cause iframes in bodyEl to do weird stuff: https://github.com/whatwg/html/issues/1813
      windowEl.style.opacity = "0";
      windowEl.style.pointerEvents = "none";
    },
    show: function() {
      windowEl.style.opacity = "1";
      windowEl.style.pointerEvents = "auto";
    },
    delete: function() {
      windowEl.remove();
    }
  };

  closeButtonEl.addEventListener("click", () => {
    api.delete();
  });

  return api;
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


export async function sha256Text(text) {
  const msgUint8 = new TextEncoder().encode(text);                          
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);          
  const hashArray = Array.from(new Uint8Array(hashBuffer));                    
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}


export function dedent(str) {
  // find the first non-whitespace character on each line, and then we find the minimum indent of all lines
  // then we remove that many spaces from the beginning of each line
  let match = str.match(/^[ \t]*(?=\S)/gm);
  if (!match) {
    return str;
  }
  let indent = Math.min(...match.map(x => x.length));
  let re = new RegExp(`^[ \\t]{${indent}}`, 'gm');
  let result = indent > 0 ? str.replace(re, '') : str;
  return result.trim(); // trim because with indented multi-line strings, the first line will almost always have a newline at the beginning, assuming regular code formatting
}


export function downloadText(text, filename) {
  const blob = new Blob([text], {type: "application/json"});
  const dataUri = URL.createObjectURL(blob);
  let linkElement = document.createElement("a");
  linkElement.setAttribute("href", dataUri);
  linkElement.setAttribute("download", filename);
  linkElement.click();
  linkElement.remove();
  setTimeout(() => URL.revokeObjectURL(dataUri), 30*1000);
} 
