import express from "express";

const PORT = 3003;

const app = express();

app.post('/', (req, res) => {
  console.log(req.body);
  res.status(200).json('сервер все еще работает');
})

app.listen(PORT, () => {
  console.log(`Server started on port: ${PORT}`);
});
