const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { login, createUser } = require('./src/controllers/users');
const auth = require('./src/middlewares/auth');

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: false,
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/signin', login);
app.post('/signup', createUser);

app.use(auth);

app.use(require('./src/routes/users'));

app.use(require('./src/routes/cards'));

app.use('/', (req, res) => res.status(404).send({ message: 'Некорректный адрес запроса.' }));

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({ message: statusCode === 500 ? 'Сервер не работает' : message });
  next(err, req, res);
});

app.listen(PORT);
