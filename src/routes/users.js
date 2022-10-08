const router = require('express').Router();

const {
  createUser, updateUserInfo, updateUserAvatar, getUser, getUsers,
} = require('../controllers/users');

router.post('/users', createUser);
router.patch('/users/me', updateUserInfo);
router.patch('/users/me/avatar', updateUserAvatar);
router.get('/users/:userId', getUser);
router.get('/users', getUsers);

module.exports = router;
