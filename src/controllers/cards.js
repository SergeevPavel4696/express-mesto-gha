const Card = require('../models/card');

const badRequest = 400;
const notFound = 404;
const serverError = 500;

const createCard = (req, res) => {
  const {
    name, link, likes, createdAt,
  } = req.body;
  return Card.create({
    name, link, owner: req.user._id, likes, createdAt,
  })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        res.status(badRequest).send({ message: 'Переданы некорректные данные.' });
      } else {
        res.status(serverError).send({ message: 'Сервер не работает.' });
      }
    });
};

const addLike = (req, res) => {
  const id = req.params.cardId;
  Card.findByIdAndUpdate(id, { $addToSet: { likes: req._id } }, { new: true, runValidators: true })
    .then((card) => {
      if (card) {
        return res.send(card);
      }
      return res.status(notFound).send({ message: 'Карточка не найдена.' });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(badRequest).send({ message: 'Переданы некорректные данные.' });
      } else {
        res.status(serverError).send({ message: 'Сервер не работает.' });
      }
    });
};

const deleteLike = (req, res) => {
  const id = req.params.cardId;
  Card.findByIdAndUpdate(id, { $pull: { likes: req._id } }, { new: true, runValidators: true })
    .then((card) => {
      if (card) {
        return res.send(card);
      }
      return res.status(notFound).send({ message: 'Карточка не найдена.' });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(badRequest).send({ message: 'Переданы некорректные данные.' });
      } else {
        res.status(serverError).send({ message: 'Сервер не работает.' });
      }
    });
};

const deleteCard = (req, res) => Card.findByIdAndRemove(req.params.cardId)
  .then((card) => {
    if (card) {
      return res.send(card);
    }
    return res.status(notFound).send({ message: 'Карточка не найдена.' });
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      res.status(badRequest).send({ message: 'Переданы некорректные данные.' });
    } else {
      res.status(serverError).send({ message: 'Сервер не работает.' });
    }
  });

const getCards = (req, res) => Card.find({})
  .then((cards) => res.send(cards))
  .catch(() => res.status(serverError).send({ message: 'Сервер не работает.' }));

module.exports = {
  createCard, addLike, deleteLike, deleteCard, getCards,
};
