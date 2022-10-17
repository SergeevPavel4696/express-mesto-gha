const router = require('express').Router();

const { celebrate, Joi } = require('celebrate');

const {
  createCard, deleteCard, getCards, addLike, deleteLike,
} = require('../controllers/cards');

router.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().pattern(/https?:\/\/(w{3})?[a-z0-9-]+\.[a-z0-9\S]{2,}/),
  }),
}), createCard);

router.put('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().hex().length(24),
  }),
}), addLike);

router.delete('/:cardId', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().hex().length(24),
  }),
}), deleteCard);
router.delete('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().hex().length(24),
  }),
}), deleteLike);

router.get('/', getCards);

module.exports = router;
