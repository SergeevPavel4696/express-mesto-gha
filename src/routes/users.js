const router = require('express').Router();

const { celebrate, Joi } = require('celebrate');

const {
  updateUserInfo, updateUserAvatar, getUser, getUsers, getMe,
} = require('../controllers/users');

router.patch('/me', updateUserInfo);
router.patch('/me/avatar', updateUserAvatar);

router.get('/', getUsers);
router.get('/me', getMe);
router.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().hex().length(24),
  }),
}), getUser);

module.exports = router;
