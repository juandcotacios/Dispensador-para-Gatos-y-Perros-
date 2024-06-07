const express = require('express');
const { SerialPort } = require('serialport');

const app = express();
const port = new SerialPort({ path: 'COM4', baudRate: 9600 }); // Actualiza aquí el puerto

app.use(express.static('public'));

app.post('/pet-detected', (req, res) => {
  port.write('1', (err) => {
    if (err) {
      return console.error('Error writing to serial port:', err);
    }
    console.log('Command sent to Arduino');
  });
  res.sendStatus(200);
});

const serverPort = 3000;
app.listen(serverPort, () => {
  console.log(`Server running at http://localhost:${serverPort}`);
});
