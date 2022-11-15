const router = require('express').Router();

const { celebrate, Joi } = require('celebrate');
const cardRouter = require('./cards');
const userRouter = require('./users');

const auth = require('../middlewares/auth');
const NotFoundError = require('../errors/NotFoundError');

const { login, createUser } = require('../controllers/users');

router.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});
router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);
router.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(/https?:\/\/(w{3})?[a-z0-9-]+\.[a-z0-9\S]{2,}/),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), createUser);
router.use(auth);
router.use('/cards', cardRouter);
router.use('/users', userRouter);
router.use('/', (req, res, next) => { next(new NotFoundError('Некорректный адрес запроса.')); });

module.exports = router;
