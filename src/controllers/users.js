const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const badRequest = 400;
const notFound = 404;
const serverError = 500;
const unauthorized = 401;

const createUser = (req, res) => {
  bcrypt.hash(req.body.password, 10)
    .then((hash) => {
      const {
        name, about, avatar, email,
      } = req.body;
      return User.create({
        name, about, avatar, email, password: hash,
      })
        .then((user) => res.send(user))
        .catch((err) => {
          if (err.name === 'CastError' || err.name === 'ValidationError') {
            res.status(badRequest).send({ message: 'Переданы некорректные данные.' });
          } else {
            res.status(serverError).send({ message: 'Сервер не работает.' });
          }
        });
    });
};

const updateUserInfo = (req, res) => {
  const { name, about } = req.body;
  return User.findByIdAndUpdate(req._id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (user) {
        return res.send(user);
      }
      return res.status(notFound).send({ message: 'Пользователь не найден.' });
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        res.status(badRequest).send({ message: 'Переданы некорректные данные.' });
      } else {
        res.status(serverError).send({ message: 'Сервер не работает.' });
      }
    });
};

const updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  return User.findByIdAndUpdate(req._id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (user) {
        return res.send(user);
      }
      return res.status(notFound).send({ message: 'Пользователь не найден.' });
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        res.status(badRequest).send({ message: 'Переданы некорректные данные.' });
      } else {
        res.status(serverError).send({ message: 'Сервер не работает.' });
      }
    });
};

const getUser = (req, res) => User.findById(req.params.userId)
  .then((user) => {
    if (user) {
      return res.send(user);
    }
    return res.status(notFound).send({ message: 'Пользователь не найден.' });
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      res.status(badRequest).send({ message: 'Переданы некорректные данные.' });
    } else {
      res.status(serverError).send({ message: 'Сервер не работает.' });
    }
  });

const getUsers = (req, res) => User.find({})
  .then((users) => res.send(users))
  .catch(() => res.status(serverError).send({ message: 'Сервер не работает.' }));

const getMe = (req, res) => User.findById(req.user._id)
  .then((user) => {
    if (user) {
      return res.send(user);
    }
    return res.status(notFound).send({ message: 'Пользователь не найден.' });
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      res.status(badRequest).send({ message: 'Переданы некорректные данные.' });
    } else {
      res.status(serverError).send({ message: 'Сервер не работает.' });
    }
  });

const login = (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email })
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Неправильные почта или пароль.'));
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new Error('Неправильные почта или пароль.'));
          }
          const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: 3600 * 24 * 7 });
          return res.send({ token });
        });
    })
    .catch((err) => res.status(unauthorized).send({ message: err.message }));
};

module.exports = {
  createUser, updateUserInfo, updateUserAvatar, getUser, getUsers, getMe, login,
};
