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
  res.sendFile(__dirname + '/test-chat.html');
});

// Socket.io for messages
// const namespaces = io.of(/^\/\w+$/);

// namespaces.on("connection", (socket) => {
//   const namespace = socket.nsp;

//   namespace.emit('ai message', msg);
//   namespace.emit('user message', msg);
// });

const namespace = io.of('/testbot');

namespace.on('connection', (socket) => {
  console.log('A user has connected to testbot');

  socket.on('ai message', (msg) => {
    console.log(`Received AI message: ${msg}`);
    namespace.emit('ai message', msg);
  });

  socket.on('user message', (msg) => {
    console.log(`Received user message: ${msg}`);
    namespace.emit('user message', msg);
  });
});

io.on('connection', (socket) => {
  console.log('A user has connected to default');

  socket.on('ai message', msg => {
    io.emit('ai message', msg);
  });
});
io.on('connection', (socket) => {
  console.log('A user has connected to default');
  
  socket.on('user message', msg => {
    io.emit('user message', msg);
  });
});


http.listen(port, () => {
  console.log(`Telegram bot integration server running at http://127.0.0.1:${port}/`);
});
