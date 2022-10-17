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
  console.log(1);
  const { cardId } = req.params;
  console.log(2);
  const { _id } = req.user;
  console.log(3);
  Card.findById(cardId).orFail(new NotFoundError('Карточка не найдена.'))
    .then((card) => {
      console.log(4);
      const ownerId = card.owner;
      console.log(5);
      if (ownerId.toString() === _id.toString()) {
        console.log(6);
        card.remove()
          .then(() => {
            console.log(7);
            res.send(card);
            console.log(8);
          });
      } else {
        console.log(9);
        throw new ForbiddenError('Вы не можете удалить чужую карточку.');
      }
    })
    .catch((err) => {
      console.log(err);
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        console.log(10);
        next(new BadRequestError('Переданы некорректные данные.'));
        console.log(11);
      } else {
        console.log(12);
        next(err);
        console.log(13);
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
