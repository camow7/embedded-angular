//Import file system
var fs = require('fs');
//initalise messages array with the saved message history
var messages = [];
var comPort = {port:"",baud:9600};
messages = JSON.parse(fs.readFileSync(__dirname + "/messages.json"));
comPort = JSON.parse(fs.readFileSync(__dirname + "/port.json"));

//Setup express server
var express  = require('express');
var app = express();
app.use(express.static(__dirname + '/dist'));
var expressConfig = {port:8080};
expressConfig = JSON.parse(fs.readFileSync(__dirname + "/expressConfig.json"));

//Simple server for websockets
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 6123 });
//initialise websocket message types for talking to client
var messageRX = {Command: '',Data: ''};
var messageTX = {Command: '',Data: ''};

//Setup Serial Port
const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');
//wait for a serial port to becom available
var availablePorts = [];
var port;
var parser;

if (comPort.port){
  //if there is a port specified in file, use that
  console.log("Connecting to port.json port " + comPort.port);
  setupSerialPort(comPort.port,comPort.baud);
}
else{
  //connect to the first port available
  SerialPort.list().then(
    ports => {
      ports.forEach(port => {
        availablePorts.push(port.comName);
      })
      console.log("Connecting on port " + String(availablePorts[0]));
      setupSerialPort(String(availablePorts[0]), comPort.baud);
    },
    err => {if(err){console.error(err)}}
  )
}

//Respond to each client that connects
wss.on('connection', function connection(ws) {
  //When a client connects for the first time, send them the current message history
  for (var i = 0; i < messages.length; i++){
    ws.send(JSON.stringify(messages[i]));
  }

  ws.on('message', function incoming(message) {
    //parse recieved message to JSON
    messageRX = JSON.parse(message);
    //Check command from client and respond appropriately
    if (messageRX.Command === "echo"){
      messages.push(messageRX);
      fs.writeFileSync(__dir + "/messages.json", JSON.stringify(messages));
      //wss.broadcast(JSON.stringify(messageRX)); //Used if you want to echo on the server without the arduino
      port.write(JSON.stringify(messageRX) + '\n\r'); //add carriage return as Arduino is expecting it
    }
    else if (messageRX.Command === "delete"){
      //remove message from memory and save to file
      messages.splice(Number(messageRX.Data), 1);
      messageTX = messageRX;
      fs.writeFileSync(__dirname + "/messages.json", JSON.stringify(messages));
      //inform all clients to delete the item from their memory
      wss.broadcast(JSON.stringify(messageTX));
    }
  });
});

//This sends a messages to all connected clients so everyone stays in sync
wss.broadcast = function broadcast(msg) {
  wss.clients.forEach(function each(client) {
      client.send(msg);
   });
};

function setupSerialPort(targetComPort, targetBaud){
  port = new SerialPort(targetComPort, {baudRate: targetBaud}, function(err){
    if(err){console.log(err)};
  });
  // Pipe the data into another stream (like a parser or standard out)
  parser = port.pipe(new Readline({ delimiter: '\n' }));
  parser.on('data', function (data) {
    wss.broadcast(data);
  });
}
//Serve up the front-end
console.log("Serving app on port " + expressConfig.port)
app.listen(expressConfig.port);
//Let the user know we are running in the console
console.log("Websockets communicating on port 6123....");


