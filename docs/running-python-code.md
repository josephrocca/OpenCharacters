# Running Python Code
You can use [Pyodide](https://github.com/pyodide/pyodide) to run Python in the browser. Note that not all Python will run in the Pyodide runtime yet, but support for more Python functionality gets added with each new version. You can request support for packages/features [here](https://github.com/pyodide/pyodide/issues), but be sure to search for existing issues first. 

To get started with Pyodide, try pasting this code in the custom code input box in the advanced area of the character editor:
```js
import "https://cdn.jsdelivr.net/pyodide/v0.23.0/full/pyodide.js";
let pyodide = await loadPyodide();
// now we can use `pyodide.runPython("1+2+3")` to run code
// and within our python code we can run `micropip.install("numpy")` to install stuff

oc.thread.on("MessageAdded", function() {
  let lastMessage = oc.thread.messages.at(-1);
  if(lastMessage.author !== "ai") return;
  let codeBlockMatch = lastMessage.content.match(/```\n(.+?)\n```/);
  if(codeBlockMatch) {
    let code = codeBlockMatch[1];
    // execute the code and add the output to a new message:
    oc.thread.messages.push({content:"Code Output:\n\n"+pyodide.runPython(code), author:"user", expectsReply:false});
  }
});
```

