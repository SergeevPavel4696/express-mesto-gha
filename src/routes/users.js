const router = require('express').Router();

const {
  updateUserInfo, updateUserAvatar, getUser, getUsers, getMe,
} = require('../controllers/users');

router.patch('/users/me', updateUserInfo);
router.patch('/users/me/avatar', updateUserAvatar);

router.get('/users', getUsers);
router.get('/users/me', getMe);
router.get('/users/:userId', getUser);

module.exports = router;
