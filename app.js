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

app.use((req, res, next) => {
  req.user = { _id: '634056e16b0b643d6cce087f' };
  next();
});

app.post('/signin', login);
app.post('/signup', createUser);

app.use(auth);

app.use(require('./src/routes/users'));

app.use(require('./src/routes/cards'));

app.use('/', (req, res) => { res.status(404).send({ message: 'Некорректный адрес запроса.' }); });

app.listen(PORT);
