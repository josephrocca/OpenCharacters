# Running OpenCharacters on your own machine
Note that when you load up OpenCharacters via the usual URL, it *is running locally on your machine* - there is no server other than the `github.io` server that sends you the HTML/JavaScript files. Once the page has loaded, it's running completely locally on your machine, other than the requests to the OpenAI API, which are unavoidably non-local either way.

But if you want to also *serve* the HTML/JavaScript files from your own machine, you can use this guide. This might be handy if you want to completely opt-in to any updates to OpenCharacters, instead of receiving updates automatically when I update this code repository.

1. [Download this project as a zip file](https://github.com/josephrocca/OpenCharacters/archive/refs/heads/main.zip) and unzip it
2. Install the [Web Server For Chrome](https://chrome.google.com/webstore/detail/web-server-for-chrome/ofhbbkphhbklhfoeikjpcbhemlocgigb/related?hl=en) web app/extension
3. Launch the app and select the unzipped folder [as shown in the intro video](https://www.youtube.com/watch?v=AK6swHiPtew)
4. **Important**: Once you select the folder and switch on the server with the toggle, it'll show you a URL like `http://127.0.0.1:8887`, but you should change it to `http://localhost:8887` because otherwise (due [very strange engineering choices](https://stackoverflow.com/questions/43895390/imgur-images-returning-403) at Imgur HQ based on the "referrer" header), Imgur images won't load. So just swap the `127.0.0.1` part to `localhost` and that'll fix image loading problems.
5. Visit the URL in your browser.

Note that chatacter URLs look like this: `https://josephrocca.github.io/OpenCharacters/#%7B%22addCharac...` but to use them with your local version you'll need to change them to this: `http://localhost:8887/#%7B%22addCharac...`. Replace `http://localhost:8887` with whatever your webserver URL is (the `8887` number might be different). So, to be clear, just take a normal character share URL and swap `https://josephrocca.github.io/OpenCharacters/` for `http://localhost:8887/`.

## Notes

If you don't like the "Web Server For Chrome" app, you're free to use any sort of web server you like, of course. If you know the basics of using the command line, then there are lots of option. You can ask ChatGPT for help based on your operating system. Just ask it something like "I have a folder that I'd like to server with a static web server on [your operating system] but I'm a noob, please give me detailed instructions on how to do that without jargon".

**IMPORTANT:** Your character/convo data is stored locally in your browser regardless of whether you serve it yourself, or use the official OpenCharacters URL. But note that a fresh database will be created for every URL that you serve on. For example, if you serve it at `http://localhost:8887` and make some characters/convos, but then later serve it at `http://localhost:3000`, you'll get a fresh database. So you'll have to go back to the `8887` URL, export your data, and then import it to the `3000` URL. This is just how browsers work. Each "site" gets its own fresh database (otherwise any random site could read all your data from other sites). The `8887`/`3000` part is called the "port", and each port is treated as its own separate website, so it has its own local database/storage allocated by the browser.

If you want to use the command line, I'd recommend Deno because it allows you to give scripts very specific permissions (e.g. only allow access to the current folder). By default it doesn't give scripts any permissions - so scripts can't do anything to harm your computer - so Deno is like a web browser in that sense - you can run code safely, and decide whether or not to give permissions that it requests. Here's how to run a server in Deno:

```bash
# First install Deno: https://deno.land
# Then open a terminal in the unzipped folder (ask ChatGPT to help if you need - you'll need to tell it your operating system)
# Then run this:
deno run --allow-net=0.0.0.0:4507 --allow-read=. https://deno.land/std@0.180.0/http/file_server.ts
# It'll give you a URL.
```
* The `--allow-net=0.0.0.0:4507` part means "give this script access to the internet, but *only* to `0.0.0.0:4507` (i.e. `localhost:4507`) so it can serve the files there"
* The `--allow-read=.` means "give this script the ability to read files on my filesystem, but *only* to `.` - i.e. the files in the current directory"
