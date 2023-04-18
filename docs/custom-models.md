**Note: This isn't entirely ready yet due to this issue:**
* https://github.com/hyperonym/basaran/issues/143

(it's possible to get around this with [a browser extension](https://chrome.google.com/webstore/detail/lhobafahddgcelffkeicbaginigeejlf), but it should be fixed within the next few days anyway)

# Custom Models

Support for external models is in beta. Please try it out and let me know about any bugs/issues.

If you open your user settings and click the button to show advanced options, you'll see an input text box that allows you to declare custom models (one per line). You can put any OpenAI API-compatible model there.

[Basaran](https://github.com/hyperonym/basaran) is a good option for running any Hugging Face model in a way that's compatible with the OpenAI-style API. Here are the steps:

### Step 1:
[Install Docker](https://docs.docker.com/get-docker/)

### Step 2:
Run this command in your terminal:
```bash
docker run --rm -p 80:80 -e MODEL=databricks/dolly-v2-3b hyperonym/basaran:0.15.3
```
Change `databricks/dolly-v2-3b` to a model name from [this list](https://huggingface.co/models?pipeline_tag=text-generation), and you can change `0.15.3` to the latest version from [here](https://hub.docker.com/r/hyperonym/basaran/tags).

### Step 3:
Add this line to that text box in your user settings:
```json5
{name:"databricks/dolly-v2-3b", endpointUrl:"http://127.0.0.1/v1/completions"}
```

### That's it

The model selector at the top of the thread should show your new model.

### Full parameter list

* `name` - passed to the API as the `model` parameter
* `endpointUrl` - the URL of the inference server's completion endpoint
* `modelUrl` (optional) - if omitted, the URL is assumed to be `https://huggingface.co/${name}` - this is used for the tokenizer & config
* `tokenPricing` (optional) - an object like `{prompt:0.002, completion:0.002}` with prices per 1k tokens
* `maxSequenceLength` (optional) - this will be fetched from Hugging Face automatically, but you should include it if you're using a non-Hugging Face model or if the value can't be found automatically
* `apiKey` (optional) - just in case you're using a service that requires an API key
* `type` (optional) - either `chat-completion` if the API accepts `messages` as an input or `completion` for APIs that accept `prompt` as an input. This will be automatically inferred from the URL (`v1/completions` vs `v1/chat/completions`)


### Alternatives to Basaran

If you know of any API wrappers for Anthropic, Cohere, etc. models that make them OpenAI API-compatible, then please let me know here on Github or on the Discord and I can make sure the custom model system works with them. It should work with any API endpoint that's compatible with OpenAI's completion APIs.
