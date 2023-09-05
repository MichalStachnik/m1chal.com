const express = require('express');
const server = require('http').createServer();
const app = express();

app.get('/', (req, res) => {
  res.sendFile('index.html', { root: __dirname });
});

server.on('request', app);
server.listen(3000, () => console.log('server started on port 3000'));

const WebSocketServer = require('ws').Server;

const wss = new WebSocketServer({ server });

const onConnect = (ws) => {
  console.log('clients connected', wss.clients.size);
  wss.broadcast(`current visitor count: ${wss.clients.size}`);

  if (ws.readyState === ws.OPEN) {
    ws.send('welcome to my simple server');
  }

  ws.on('close', () => {
    console.log('client has disconnected');
    wss.broadcast(`current visitor count: ${wss.clients.size}`);
  });
};

wss.broadcast = (data) => {
  wss.clients.forEach((client) => {
    client.send(data);
  });
};

wss.on('connection', onConnect);
