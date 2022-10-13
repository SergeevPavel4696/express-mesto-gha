const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const badRequest = 400;
const unAuthorized = 401;
const notFound = 404;
const serverError = 500;

const createUser = (req, res) => {
  const {
    name, about, avatar, email,
  } = req.body;
  bcrypt.hash(req.body.password, 10)
    .then((password) => {
      User.create({
        name, about, avatar, email, password,
      })
        .then((user) => {
          res.send(user);
        })
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
  const id = req._id;
  User.findByIdAndUpdate(id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (user) {
        res.send(user);
      } else {
        res.status(notFound).send({ message: 'Пользователь не найден.' });
      }
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
  const id = req._id;
  User.findByIdAndUpdate(id, avatar, { new: true, runValidators: true })
    .then((user) => {
      if (user) {
        res.send(user);
      } else {
        res.status(notFound).send({ message: 'Пользователь не найден.' });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        res.status(badRequest).send({ message: 'Переданы некорректные данные.' });
      } else {
        res.status(serverError).send({ message: 'Сервер не работает.' });
      }
    });
};

const getUser = (req, res) => {
  const id = req.params.userId;
  User.findById(id)
    .then((user) => {
      if (user) {
        res.send(user);
      } else {
        res.status(notFound).send({ message: 'Пользователь не найден.' });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(badRequest).send({ message: 'Переданы некорректные данные.' });
      } else {
        res.status(serverError).send({ message: 'Сервер не работает.' });
      }
    });
};

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => res.status(serverError).send({ message: 'Сервер не работает.' }));
};

const getMe = (req, res) => {
  const id = req.user._id;
  User.findById(id)
    .then((user) => {
      if (user) {
        res.send(user);
      } else {
        res.status(notFound).send({ message: 'Пользователь не найден.' });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(badRequest).send({ message: 'Переданы некорректные данные.' });
      } else {
        res.status(serverError).send({ message: 'Сервер не работает.' });
      }
    });
};

const login = (req, res) => {
  const { email, password } = req.body;
  User.findOne(email).select('+password')
    .then((user) => {
      if (user) {
        bcrypt.compare(password, user.password)
          .then((matched) => {
            if (matched) {
              const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: 604800 });
              res.send({ token });
            } else {
              Promise.reject(new Error('Неправильные почта или пароль.'));
            }
          });
      } else {
        Promise.reject(new Error('Неправильные почта или пароль.'));
      }
    })
    .catch((err) => {
      res.status(unAuthorized).send({ message: err.message });
    });
};

module.exports = {
  createUser, updateUserInfo, updateUserAvatar, getUser, getUsers, getMe, login,
};
