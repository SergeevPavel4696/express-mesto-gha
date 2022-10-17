const Card = require('../models/card');
const BadRequestError = require('../errors/BadRequestError');
const ForbiddenError = require('../errors/ForbiddenError');
const NotFoundError = require('../errors/NotFoundError');

const createCard = (req, res, next) => {
  const {
    name, link, likes, createdAt,
  } = req.body;
  const owner = req.user._id;
  Card.create({
    name, link, owner, likes, createdAt,
  })
    .then((card) => {
      if (card) {
        res.send(card);
      } else {
        throw new BadRequestError('Переданы некорректные данные.');
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные.'));
      } else {
        next();
      }
    });
};

const deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  const { _id } = req.user;
  Card.findById(cardId)
    .then((card) => {
      const ownerId = card.owner;
      if (card) {
        if (ownerId.toString() === _id.toString()) {
          Card.findByIdAndRemove(cardId)
            .then(() => {
              res.send(card);
            });
        } else {
          throw new ForbiddenError('Вы не можете удалить чужую карточку.');
        }
      } else {
        throw new NotFoundError('Карточка не найдена.');
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные.'));
      } else {
        next();
      }
    });
};

const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => {
      if (cards) {
        res.send(cards);
      } else {
        throw new NotFoundError('Карточки не найдены.');
      }
    })
    .catch(next);
};

const addLike = (req, res, next) => {
  const { cardId } = req.params;
  const { _id } = req.user;
  Card.findByIdAndUpdate(cardId, { $addToSet: { likes: _id } }, { new: true, runValidators: true })
    .then((card) => {
      if (card) {
        res.send(card);
      } else {
        throw new NotFoundError('Карточка не найдена.');
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные.'));
      } else {
        next();
      }
    });
};

const deleteLike = (req, res, next) => {
  const { cardId } = req.params;
  const { _id } = req.user;
  Card.findByIdAndUpdate(cardId, { $pull: { likes: _id } }, { new: true, runValidators: true })
    .then((card) => {
      if (card) {
        res.send(card);
      } else {
        throw new NotFoundError('Карточка не найдена.');
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные.'));
      } else {
        next();
      }
    });
};

module.exports = {
  createCard, deleteCard, getCards, addLike, deleteLike,
};
