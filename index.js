require('dotenv').config({
  path: '.env.production'
});

const express = require('express');
const app = express();
const auth = require('./components/auth');
const store = require('./components/store');
const {json} = require('body-parser');
const cors = require('cors');

app.use(cors());
app.use(json());

app.use('/api', auth);

app.use('/api/configuration', store);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log('Server Running!');
});