const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http, {
  cors: {
    origin: "*",
    methods: ["*"]
  }
});
const port = process.env.PORT || 4000;

// Serve test-chat page
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/local-chat.html');
});

// We will create a namespace for each bot, on the client 
// side we do this with:
//  const namespace = oc.character.name.toLowerCase();
// then we use this in the set up for the socket connection:
//   const socket = io(`http://127.0.0.1:4000/${namespace}`);
const namespaces = io.of(/^\/\w+$/);

namespaces.on('connection', (socket) => {
  const namespace = socket.nsp;
  console.log(`A user has connected to ${namespace.name}`);

  socket.on("namespace change", (namespace) => {
    socket.leave(socket.room);
    socket.join(namespace);
    socket.room = namespace;
    console.log(`User joined namespace ${namespace}`);
  });

  socket.on('ai message', (msg) => {
    console.log(`Received ai message: ${msg} in ${namespace.name}`);
    namespace.emit('ai message', msg);
  });

  socket.on('user message', (msg) => {
    console.log(`Received user message: ${msg} in ${namespace.name}`);
    namespace.emit('user message', msg);
  });
});

http.listen(port, () => {
  console.log(`Telegram bot integration server running at http://127.0.0.1:${port}/`);
});
