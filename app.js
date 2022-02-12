const express = require("express");
const mongoose = require("mongoose");
const { errors } = require("celebrate");
const router = require("./routes/index");
const cookieParser = require("cookie-parser");
const errorHandler = require("./middlewares/error-handler");

const { ENV_PORT, MONGO_DB_URL } = require("./utils/conf");

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(router);

const start = async () => {
  try {
    await mongoose.connect(MONGO_DB_URL);
    app.listen(ENV_PORT, () => {
      console.log(`Server started on port: ${ENV_PORT}`);
    });
  } catch (e) {
    console.log(e);
  }
};

app.use(errors());
app.use(errorHandler);

start();
