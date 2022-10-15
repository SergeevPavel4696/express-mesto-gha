const Card = require('../models/card');
const BadRequestError = require('../errors/BadRequestError');
const ForbiddenError = require('../errors/ForbiddenError');
const NotFoundError = require('../errors/NotFoundError');

const createCard = (req, res, next) => {
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
        Promise.reject(new BadRequestError('Карточка не создана.'));
      }
    })
    .catch(next);
};

const deleteCard = (req, res, next) => {
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
          Promise.reject(new ForbiddenError('Вы не можете удалить чужую карточку.'));
        }
      } else {
        Promise.reject(new NotFoundError('Карточка не найдена.'));
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
        Promise.reject(new NotFoundError('Карточки не найдены.'));
      }
    })
    .catch(next);
};

const addLike = (req, res, next) => {
  const id = req.params.cardId;
  const { likes } = req._id;
  Card.findByIdAndUpdate(id, { $addToSet: { likes } }, { new: true, runValidators: true })
    .then((card) => {
      if (card) {
        res.send(card);
      } else {
        Promise.reject(new NotFoundError('Карточка не найдена.'));
      }
    })
    .catch(next);
};

const deleteLike = (req, res, next) => {
  const id = req.params.cardId;
  const { likes } = req._id;
  Card.findByIdAndUpdate(id, { $pull: { likes } }, { new: true, runValidators: true })
    .then((card) => {
      if (card) {
        res.send(card);
      } else {
        Promise.reject(new NotFoundError('Карточка не найдена.'));
      }
    })
    .catch(next);
};

module.exports = {
  createCard, deleteCard, getCards, addLike, deleteLike,
};
