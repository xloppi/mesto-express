const express = require('express');
const mongoose = require('mongoose');
const {errors} = require('celebrate');
const router = require('./routes/index');
const errorHandler = require('./middlewares/error-handler');

const PORT = 3003;
const DB_URL = 'mongodb://localhost:27017/mestodb';

const app = express();

app.use(express.json())
app.use(router);

const start = async () => {
  try {
    await mongoose.connect(DB_URL);
    app.listen(PORT, () => {
      console.log(`Server started on port: ${PORT}`);
    });
  } catch(e) {
    console.log(e);
  }
}

app.use(errors());
app.use(errorHandler);

start();