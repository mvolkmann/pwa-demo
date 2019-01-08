'use strict';
const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');
const fs = require('fs');
const morgan = require('morgan');

const app = express();
app.use(cors());
app.use(morgan('short')); // logging
app.use(bodyParser.text());
app.use(express.static('./public'));

const filePath = 'total.txt';

let total = Number(fs.readFileSync(filePath));
console.log('server.js x: total =', total);

function setTotal(newTotal) {
  console.log('server.js setTotal: newTotal =', newTotal);
  fs.writeFileSync(filePath, newTotal);
  total = newTotal;
}

app.delete('/total', (req, res) => {
  setTotal(0);
  res.send();
});

app.get('/total', (req, res) => res.send(String(total)));

app.post('/total', (req, res) => {
  const number = Number(req.body);
  setTotal(total + number);
  res.send(String(total));
});

const port = 3000;
app.listen(port, () => console.log('listening on port', port));
