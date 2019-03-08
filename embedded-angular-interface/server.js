//Import file system
var fs = require('fs');
var messages = JSON.parse(fs.readFileSync("messages.json"));
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
      messages.push(messageRX);
      if (messageRX.Command === "echo"){
          port.write(JSON.stringify(messageRX) + '\n\r'); //add carriage return as Arduino is expecting it
          fs.writeFileSync("messages.json", JSON.stringify(messages));
      }
  });

  parser.on('data', function (data) {
    ws.send(data);
  });

});


