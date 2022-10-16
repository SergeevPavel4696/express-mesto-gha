const router = require('express').Router();

const {
  createCard, deleteCard, getCards, addLike, deleteLike,
} = require('../controllers/cards');

router.post('/', createCard);

router.put('/:cardId/likes', addLike);

router.delete('/:cardId', deleteCard);
router.delete('/:cardId/likes', deleteLike);

router.get('/', getCards);

module.exports = router;
