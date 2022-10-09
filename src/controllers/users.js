const User = require('../models/user');

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  return User.create({ name, about, avatar })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные.' });
      } else {
        res.status(500).send({ message: 'Сервер не работает.' });
      }
    });
};

const updateUserInfo = (req, res) => {
  const { name, about } = req.body;
  return User.findByIdAndUpdate(req._id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (user) {
        return res.send(user);
      }
      return res.status(404).send({ message: 'Пользователь не найден.' });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Переданы некорректные данные.' });
      } else {
        res.status(500).send({ message: 'Сервер не работает.' });
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
      return res.status(404).send({ message: 'Пользователь не найден.' });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Переданы некорректные данные.' });
      } else {
        res.status(500).send({ message: 'Сервер не работает.' });
      }
    });
};

const getUser = (req, res) => User.findById(req.params.userId)
  .then((user) => {
    if (user) {
      return res.send(user);
    }
    return res.status(404).send({ message: 'Пользователь не найден.' });
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      res.status(400).send({ message: 'Переданы некорректные данные.' });
    } else {
      res.status(500).send({ message: 'Сервер не работает.' });
    }
  });

const getUsers = (req, res) => User.find({})
  .then((users) => res.send(users))
  .catch(() => res.status(500).send({ message: 'Сервер не работает.' }));

module.exports = {
  createUser, updateUserInfo, updateUserAvatar, getUser, getUsers,
};
