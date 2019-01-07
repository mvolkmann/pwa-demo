'use strict';
const cors = require('cors');
const express = require('express');
const morgan = require('morgan');

const app = express();
app.use(cors());
app.use(morgan('short')); // logging
app.use(express.static('./public'));

app.get('/list', (req, res) => {
  const data = {foo: 1, bar: 2};
  res.json(data);
});

const port = 3000;
app.listen(port, () => console.log('listening on port', port));
