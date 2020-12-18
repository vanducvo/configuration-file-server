require('dotenv').config();

const express = require('express');
const app = express();
const auth = require('./components/auth');
const store = require('./components/store');
const {json} = require('body-parser');

app.use(json());

app.use('/api', auth);

app.use('/api/configuration', store);

app.listen(8080, () => {
  console.log('Server Running!');
});