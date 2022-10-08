const Card = require('../models/card');

const createCard = (req, res) => {
  const {
    name, link, likes, createdAt,
  } = req.body;
  return Card.create({
    name, link, owner: req._id, likes, createdAt,
  })
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.name === 'SomeErrorName' || err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные.' });
      } else {
        res.status(500).send({ message: 'Сервер не работает.' });
      }
    });
};

const addLike = (req, res) => {
  const id = req.params.cardId;
  Card.findByIdAndUpdate(id, { $addToSet: { likes: req._id } }, { new: true, runValidators: true })
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.name === 'SomeErrorName' || err.name === 'CastError') {
        res.status(400).send({ message: 'Переданы некорректные данные.' });
      } else {
        res.status(500).send({ message: 'Сервер не работает.' });
      }
    });
};

const deleteLike = (req, res) => {
  const id = req.params.cardId;
  Card.findByIdAndUpdate(id, { $pull: { likes: req._id } }, { new: true, runValidators: true })
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.name === 'SomeErrorName' || err.name === 'CastError') {
        res.status(400).send({ message: 'Переданы некорректные данные.' });
      } else {
        res.status(500).send({ message: 'Сервер не работает.' });
      }
    });
};

const deleteCard = (req, res) => Card.findByIdAndRemove(req.params.cardId)
  .then((card) => res.status(200).send(card))
  .catch((err) => {
    if (err.name === 'SomeErrorName' || err.name === 'CastError') {
      res.status(400).send({ message: 'Переданы некорректные данные.' });
    } else {
      res.status(500).send({ message: 'Сервер не работает.' });
    }
  });

const getCards = (req, res) => Card.find({})
  .then((cards) => res.status(200).send(cards))
  .catch((err) => {
    if (err.name === 'SomeErrorName') {
      res.status(400).send({ message: 'Переданы некорректные данные.' });
    } else {
      res.status(500).send({ message: 'Сервер не работает.' });
    }
  });

module.exports = {
  createCard, addLike, deleteLike, deleteCard, getCards,
};
