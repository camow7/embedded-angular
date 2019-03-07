//Simple server for websockets
const WebSocket = require('ws');
//Setup Serial Port
// Require the serialport node module
const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');
var port = new SerialPort('COM5', {
  baudRate: 1000000,
});

const wss = new WebSocket.Server({ port: 6123 });
var messageRX = {Command: '',Data: ''};
var messageTX = {Command: '',Data: ''};

// Pipe the data into another stream (like a parser or standard out)
const parser = port.pipe(new Readline({ delimiter: '\n' }));


wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
      messageRX = JSON.parse(message);
      if (messageRX.Command === "echo"){
          messageTX = messageRX;
          port.write(JSON.stringify(messageTX) + '\n\r'); //add carriage return as Arduino is expecting it
      }
  });

  parser.on('data', function (data) {
    ws.send(data);
  });

});


