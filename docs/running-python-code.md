# Running Python Code
You can use [Pyodide](https://github.com/pyodide/pyodide) to run Python in the browser. Note that not all Python packages will run in the Pyodide runtime yet, but support for more Python functionality gets added with each new version. You can request support for packages/features [here](https://github.com/pyodide/pyodide/issues), but be sure to search for existing issues first. 

To get started with Pyodide, try pasting this code in the custom code input box in the advanced area of the character editor:
```js
import "https://cdn.jsdelivr.net/pyodide/v0.23.0/full/pyodide.js";
let pyodide = await loadPyodide();
await pyodide.loadPackage("micropip");
```
Now you can use `await pyodide.runPythonAsync("1+2+3")` to run code, and within our python code we can run `await micropip.install("numpy")` to install stuff.

For example, here's some custom code that you can paste into your character's custom code box which will look for code blocks in their messages, and execute them:
```js
import "https://cdn.jsdelivr.net/pyodide/v0.23.0/full/pyodide.js";

let pyodide = await loadPyodide({
  stdout: (line) => { printed.push(line); },
  stderr: (line) => { errors.push(line); },
});
let printed = [];
let errors = [];

await pyodide.loadPackage("micropip");

oc.thread.on("MessageAdded", async function() {
  let lastMessage = oc.thread.messages.at(-1);
  if(lastMessage.author !== "ai") return;
  let codeBlockMatches = [...lastMessage.content.matchAll(/```(?:python|py)?\n(.+?)\n```/gs)];
  if(codeBlockMatches.length > 0) {
    let code = codeBlockMatches.map(m => m[1]).join("\n"); // merge all code blocks into one
    // execute the code and add the output to a new message:
    printed = [];
    errors = [];
    await pyodide.runPythonAsync(code).catch(e => errors.push(e.message));
    let content = "";
    if(printed.length > 0) content += `**Code Execution Output**:\n\n${printed.join("\n")}`;
    if(errors.length > 0) content += `\n\n**Code Execution Errors**:\n\n\`\`\`\n${errors.join("\n")}\n\`\`\``;
    if(!content.trim()) content = "(The code block in the previous message did not `print` anything - there was no output.)";
    oc.thread.messages.push({content, author:"user", expectsReply:false});
  }
});
```
