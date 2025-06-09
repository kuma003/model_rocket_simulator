const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const pool = require('./db');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
  console.log('Client connected');

  ws.on('message', async (message) => {
    console.log('Received:', message);

    try {
      await pool.query('INSERT INTO messages(content) VALUES($1)', [message]);
      ws.send('Message saved: ' + message);
    } catch (err) {
      console.error('DB Error:', err);
      ws.send('Error saving message!');
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

server.listen(5000, () => {
  console.log('Server started on port 5000');
});
