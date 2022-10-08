const Card = require('../models/card');

const createCard = (req, res) => {
  const { name, link } = req.body;
  return Card.create({ name, link, owner: req._id })
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.name === 'SomeErrorName') {
        res.status(400).send({ message: 'Переданы некорректные данные.' });
      } else {
        res.status(500).send({ message: 'Сервер не работает.' });
      }
    });
};

const addLike = (req, res) => Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req._id } }, { new: true })
  .then((card) => res.status(200).send(card))
  .catch((err) => {
    if (err.name === 'SomeErrorName') {
      res.status(400).send({ message: 'Переданы некорректные данные.' });
    } else if (err.name === 'CastError') {
      res.status(404).send({ message: 'Карточка не найдена.' });
    } else {
      res.status(500).send({ message: 'Сервер не работает.' });
    }
  });

const deleteLike = (req, res) => Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req._id } }, { new: true })
  .then((card) => res.status(200).send(card))
  .catch((err) => {
    if (err.name === 'SomeErrorName') {
      res.status(400).send({ message: 'Переданы некорректные данные.' });
    } else if (err.name === "CastError") {
      res.status(404).send({ message: 'Карточка не найдена.' });
    } else {
      res.status(500).send({ message: 'Сервер не работает.' });
    }
  });

const getCard = (req, res) => Card.findById(req.params.cardId)
  .then((card) => res.status(200).send(card))
  .catch((err) => {
    if (err.name === 'CastError') {
      res.status(404).send({ message: 'Карточка не найдена.' });
    } else {
      res.status(500).send({ message: 'Сервер не работает.' });
    }
  });

const getCards = (req, res) => Card.find({})
  .then((cards) => res.status(200).send(cards))
  .catch((err) => {
    if (err.name === 'SomeErrorName') {
      res.status(400).send({ message: 'Переданы некорректные данные.' })
    } else {
      res.status(500).send({ message: 'Сервер не работает.' })
    }
  });

module.exports = { createCard, addLike, deleteLike, getCard, getCards };
