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
            throw new BadRequestError('Пользователь не создан.');
          }
        })
        .catch((err) => {
          if (err.code === 11000) {
            next(new AlreadyExistsError('Пользователь с указанным email уже существует.'));
          } else if (err.name === 'ValidationError') {
            next(new BadRequestError(err.message));
          } else {
            next();
          }
        });
    });
};

const updateUserInfo = (req, res, next) => {
  const { name, about } = req.body;
  const { _id } = req.user;
  User.findByIdAndUpdate(_id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (user) {
        res.send(user);
      } else {
        throw new NotFoundError('Пользователь не найден.');
      }
    })
    .catch(next);
};

const updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;
  const { _id } = req.user;
  User.findByIdAndUpdate(_id, avatar, { new: true, runValidators: true })
    .then((user) => {
      if (user) {
        res.send(user);
      } else {
        throw new NotFoundError('Пользователь не найден.');
      }
    })
    .catch(next);
};

const getUser = (req, res, next) => {
  const { userId } = req.params;
  User.findById(userId)
    .then((user) => {
      if (user) {
        res.send(user);
      } else {
        throw new NotFoundError('Пользователь не найден.');
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Некорректный id.'));
      } else {
        next(err);
      }
    });
};

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      if (users) {
        res.send(users);
      } else {
        throw new NotFoundError('Пользователи не найдены.');
      }
    })
    .catch(next);
};

const getMe = (req, res, next) => {
  const { _id } = req.user;
  User.findById(_id)
    .then((user) => {
      if (user) {
        res.send(user);
      } else {
        throw new NotFoundError('Пользователь не найден.');
      }
    })
    .catch(next);
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email }).select('+password')
    .then((user) => {
      if (user) {
        const { _id } = user;
        bcrypt.compare(password, user.password)
          .then((matched) => {
            if (matched) {
              const token = jwt.sign({ _id }, 'some-secret-key', { expiresIn: '7d' });
              res.cookie('token', token, { maxAge: 604800, httpOnly: true });
              res.send({ token });
            } else {
              throw new UnAuthorizedError('Неправильные почта или пароль.');
            }
          });
      } else {
        throw new UnAuthorizedError('Неправильные почта или пароль.');
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new UnAuthorizedError(err.message));
      } else {
        next();
      }
    });
};

module.exports = {
  createUser, updateUserInfo, updateUserAvatar, getUser, getUsers, getMe, login,
};
