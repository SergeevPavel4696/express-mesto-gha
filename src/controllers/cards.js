const Card = require('../models/card');
const BadRequestError = require('../errors/BadRequestError');
const ForbiddenError = require('../errors/ForbiddenError');
const NotFoundError = require('../errors/NotFoundError');

const createCard = (req, res, next) => {
  const {
    name, link, likes, createdAt,
  } = req.body;
  const { _id } = req.user;
  Card.create({
    name, link, owner: _id, likes, createdAt,
  })
    .then((card) => {
      if (card) {
        res.send(card);
      } else {
        throw new BadRequestError('Карточка не создана.');
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные.'));
      } else {
        next(err);
      }
    });
};

const deleteCard = (req, res, next) => {
  const { cardId } = req.params.cardId;
  const { _id } = req.user;
  Card.findById(cardId)
    .then((card) => {
      const ownerId = card.owner;
      if (card) {
        if (ownerId === _id) {
          card.remove()
            .then(() => {
              res.send(card);
            })
            .catch(() => {
              res.send({ message: 'Не удалось удалить карточку.' });
            });
        } else {
          throw new ForbiddenError('Вы не можете удалить чужую карточку.');
        }
      } else {
        throw new NotFoundError('Карточка не найдена.');
      }
    })
    .catch(next);
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
  const { _id } = req;
  Card.findByIdAndUpdate(cardId, { $addToSet: { likes: _id } }, { new: true, runValidators: true })
    .then((card) => {
      if (card) {
        res.send(card);
      } else {
        throw new NotFoundError('Карточка не найдена.');
      }
    })
    .catch(next);
};

const deleteLike = (req, res, next) => {
  const { cardId } = req.params;
  const { _id } = req;
  Card.findByIdAndUpdate(cardId, { $pull: { likes: _id } }, { new: true, runValidators: true })
    .then((card) => {
      if (card) {
        res.send(card);
      } else {
        throw new NotFoundError('Карточка не найдена.');
      }
    })
    .catch(next);
};

module.exports = {
  createCard, deleteCard, getCards, addLike, deleteLike,
};
