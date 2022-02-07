const express = require('express');
const mongoose = require('mongoose');
const router = require('./routes/index');

const PORT = 3003;
const DB_URL = 'mongodb://localhost:27017/mestodb';

const app = express();

app.use(express.json())
app.use(router);

app.post('/', (req, res) => {
  console.log(req.body);
  res.status(200).json('сервер все еще работает');
})

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

start();