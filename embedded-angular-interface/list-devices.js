const SerialPort = require('serialport');
SerialPort.list().then(
    ports => {
      ports.forEach(port => {
        console.log(port.comName);
      })
    },
    err => {if(err){console.error(err)}}
  )