const router = require('express').Router();

const {
  updateUserInfo, updateUserAvatar, getUser, getUsers, getMe,
} = require('../controllers/users');

router.patch('/me', updateUserInfo);
router.patch('/me/avatar', updateUserAvatar);

router.get('/', getUsers);
router.get('/me', getMe);
router.get('/:userId', getUser);

module.exports = router;
