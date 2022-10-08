const router = require('express').Router();

const {
  createCard, addLike, deleteLike, getCard, deleteCard, getCards,
} = require('../controllers/cards');

router.post('/cards', createCard);
router.put('/cards/:cardId/likes', addLike);
router.delete('/cards/:cardId/likes', deleteLike);
router.get('/cards/:cardId', getCard);
router.delete('/cards/:cardId', deleteCard);
router.get('/cards', getCards);

module.exports = router;
