const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const UnAuthorizedError = require('../errors/UnAuthorizedError');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const AlreadyExistsError = require('../errors/AlreadyExistsError');

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => {
      User.create({
        name, about, avatar, email, password: hash,
      })
        .then((user) => {
          if (user) {
            const newUser = user.toObject();
            delete newUser.password;
            res.send(newUser);
          } else {
            Promise.reject(new BadRequestError('Пользователь не создан.'));
          }
        })
        .catch((err) => {
          if (err.code === 11000) {
            next(new AlreadyExistsError('Пользователь с указанным email уже существует.'));
          } else {
            next();
          }
        });
    });
};

const updateUserInfo = (req, res, next) => {
  const { name, about } = req.body;
  const id = req._id;
  User.findByIdAndUpdate(id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (user) {
        res.send(user);
      } else {
        Promise.reject(new NotFoundError('Пользователь не найден.'));
      }
    })
    .catch(next);
};

const updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;
  const id = req._id;
  User.findByIdAndUpdate(id, avatar, { new: true, runValidators: true })
    .then((user) => {
      if (user) {
        res.send(user);
      } else {
        Promise.reject(new NotFoundError('Пользователь не найден.'));
      }
    })
    .catch(next);
};

const getUser = (req, res, next) => {
  const id = req.params.userId;
  User.findById(id)
    .then((user) => {
      if (user) {
        res.send(user);
      } else {
        Promise.reject(new NotFoundError('Пользователь не найден.'));
      }
    })
    .catch(next);
};

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      if (users) {
        res.send(users);
      } else {
        Promise.reject(new NotFoundError('Пользователи не найдены.'));
      }
    })
    .catch(next);
};

const getMe = (req, res, next) => {
  const id = req.user._id;
  User.findById(id)
    .then((user) => {
      if (user) {
        res.send(user);
      } else {
        Promise.reject(new NotFoundError('Пользователь не найден.'));
      }
    })
    .catch(next);
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne(email).select('+password')
    .then((user) => {
      if (user) {
        const { _id } = user;
        bcrypt.compare(password, user.password)
          .then((matched) => {
            if (matched) {
              const token = jwt.sign(_id, 'some-secret-key', { expiresIn: 3600 * 24 * 7 });
              res.send({ token });
            } else {
              Promise.reject(new UnAuthorizedError('Неправильные почта или пароль.'));
            }
          });
      } else {
        next(new UnAuthorizedError('Неправильные почта или пароль.'));
      }
    })
    .catch(next);
};

module.exports = {
  createUser, updateUserInfo, updateUserAvatar, getUser, getUsers, getMe, login,
};
