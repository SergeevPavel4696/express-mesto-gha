const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { celebrate, Joi, errors } = require('celebrate');
const cookieParser = require('cookie-parser');

const { login, createUser } = require('./src/controllers/users');

const cardRouter = require('./src/routes/cards');
const userRouter = require('./src/routes/users');
const NotFoundError = require('./src/errors/NotFoundError');

const auth = require('./src/middlewares/auth');
const errorHandler = require('./src/middlewares/errorHandler');
const { requestLogger, errorLogger } = require('./src/middlewares/logger');

const { PORT = 3000 } = process.env;
const app = express();
const allowedCors = [
  'http://sergeevpavel.mesto.nomoredomains.icu',
  'https://sergeevpavel.mesto.nomoredomains.icu',
  'localhost:3000',
  'http://localhost:3000',
  'https://localhost:3000',
];

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use((req, res, next) => {
  const { origin } = req.headers;
  if (allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Credentials', true);
  }
  const { method } = req;
  const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';
  const requestHeaders = req.headers['access-control-request-headers'];
  if (method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
    res.header('Access-Control-Allow-Headers', requestHeaders);
    return res.end();
  }
  return next();
});

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: false,
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(requestLogger);

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(/https?:\/\/(w{3})?[a-z0-9-]+\.[a-z0-9\S]{2,}/),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), createUser);

app.use('/users', userRouter);
app.use('/cards', cardRouter);
app.use('/', (req, res, next) => {
  next(new NotFoundError('Некорректный адрес запроса.'));
});

app.use(errorLogger);

app.use(errors());
app.use(errorHandler);

app.listen(PORT);

app.use(auth);
