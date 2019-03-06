//Simple server for websockets
const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 6123 });
var messageRX = {Command: '',Data: ''};
var messageTX = {Command: '',Data: ''};

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
      messageRX = JSON.parse(message);
      if (messageRX.Command === "echo"){
          messageTX = messageRX;
          ws.send(JSON.stringify(messageTX));
      }
  });
});
