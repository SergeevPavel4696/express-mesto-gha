const Card = require('../models/card');

const badRequest = 400;
const forbidden = 403;
const notFound = 404;
const serverError = 500;

const createCard = (req, res) => {
  const {
    name, link, likes, createdAt,
  } = req.body;
  const { owner } = req.user._id;
  Card.create({
    name, link, owner, likes, createdAt,
  })
    .then((card) => {
      if (card) {
        res.send(card);
      } else {
        res.status(badRequest).send({ message: 'Карточка не создана.' });
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

const deleteCard = (req, res) => {
  const id = req.params.cardId;
  const userId = req.user._id;
  Card.findById(id)
    .then((card) => {
      const ownerId = card.owner;
      if (card) {
        if (ownerId === userId) {
          card.remove()
            .then(() => {
              res.send(card);
            })
            .catch(() => {
              res.send({ message: 'Не удалось удалить карточку.' });
            });
        } else {
          res.status(forbidden).send('Вы не можете удалить чужую карточку');
        }
      } else {
        res.status(notFound).send({ message: 'Карточка не найдена.' });
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

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => {
      if (cards) {
        res.send(cards);
      } else {
        res.status(notFound).send({ message: 'Карточки не найдены.' });
      }
    })
    .catch(() => {
      res.status(serverError).send({ message: 'Сервер не работает.' });
    });
};

const addLike = (req, res) => {
  const id = req.params.cardId;
  const { likes } = req._id;
  Card.findByIdAndUpdate(id, { $addToSet: { likes } }, { new: true, runValidators: true })
    .then((card) => {
      if (card) {
        res.send(card);
      } else {
        res.status(notFound).send({ message: 'Карточка не найдена.' });
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

const deleteLike = (req, res) => {
  const id = req.params.cardId;
  const { likes } = req._id;
  Card.findByIdAndUpdate(id, { $pull: { likes } }, { new: true, runValidators: true })
    .then((card) => {
      if (card) {
        res.send(card);
      } else {
        res.status(notFound).send({ message: 'Карточка не найдена.' });
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

module.exports = {
  createCard, deleteCard, getCards, addLike, deleteLike,
};
