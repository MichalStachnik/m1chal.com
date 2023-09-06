const express = require('express');
const server = require('http').createServer();
const app = express();

app.get('/', (req, res) => {
  res.sendFile('index.html', { root: __dirname });
});

server.on('request', app);
server.listen(3000, () => console.log('server started on port 3000'));

process.on('SIGINT', () => {
  wss.clients.forEach((client) => {
    client.close();
  });
  server.close(() => {
    shutdown();
  });
});

const WebSocketServer = require('ws').Server;

const wss = new WebSocketServer({ server });

const onConnect = (ws) => {
  console.log('clients connected', wss.clients.size);
  wss.broadcast(`a new visitor entered: ${wss.clients.size}`);

  if (ws.readyState === ws.OPEN) {
    ws.send('welcome to my simple server');
  }

  db.run(`INSERT INTO visitors (count, time)
    VALUES (${wss.clients.size} datetime('now'))
  `);

  ws.on('close', () => {
    console.log('client has disconnected');
    wss.broadcast(`a visitor has left: ${wss.clients.size}`);
  });

  ws.on('error', console.error);
};

wss.broadcast = (data) => {
  wss.clients.forEach((client) => {
    client.send(data);
  });
};

wss.on('connection', function connection(ws) {
  const numClients = wss.clients.size;

  console.log('clients connected: ', numClients);

  // Log number of visitors at current moment
  db.run(`INSERT INTO visitors (count, time)
    VALUES (${numClients}, datetime('now'))`);

  wss.broadcast(`Current visitors: ${numClients}`);

  if (ws.readyState === ws.OPEN) {
    ws.send('welcome!');
  }

  ws.on('close', function close() {
    wss.broadcast(`Current visitors: ${wss.clients.size}`);
    console.log('A client has disconnected');
  });

  ws.on('error', function error() {});
});

// wss.on('connection', onConnect);

const sqlite = require('sqlite3');

const db = new sqlite.Database(':memory:');

db.serialize(() => {
  db.run(`
    CREATE TABLE visitors (
      count INTEGER,
      time TEXT
    )
  `);
});

const getCounts = () => {
  db.each('SELECT * FROM visitors', (err, row) => {
    console.log('row', row);
  });
};

const shutdown = () => {
  getCounts();
  db.close();
};
