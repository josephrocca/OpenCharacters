const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http, {
  cors: {
    origin: "*",
    methods: ["*"]
  }
});
const port = process.env.PORT || 4000;

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/test-chat.html');
});

io.on('connection', (socket) => {
  socket.on('ai message', msg => {
    io.emit('ai message', msg);
  });
});
io.on('connection', (socket) => {
  socket.on('user message', msg => {
    io.emit('user message', msg);
  });
});

http.listen(port, () => {
  console.log(`Telegram bot integration server running at http://127.0.0.1:${port}/`);
});
