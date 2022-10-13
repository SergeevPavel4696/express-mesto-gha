const router = require('express').Router();

const {
  createCard, deleteCard, getCards, addLike, deleteLike,
} = require('../controllers/cards');

router.post('/cards', createCard);

router.put('/cards/:cardId/likes', addLike);

router.delete('/cards/:cardId', deleteCard);
router.delete('/cards/:cardId/likes', deleteLike);

router.get('/cards', getCards);

module.exports = router;
