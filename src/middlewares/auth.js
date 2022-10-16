const jwt = require('jsonwebtoken');
const UnAuthorizedError = require('../errors/UnAuthorizedError');

const auth = (req, res, next) => {
  if (!req.cookies) {
    throw new UnAuthorizedError('Необходимаавторизация');
  }
  let payload;
  try {
    payload = jwt.verify(req.cookies.token, 'some-secret-key');
  } catch (err) {
    throw new UnAuthorizedError('Необходима авторизация');
  }
  req.user = payload;
  next();
};

module.exports = auth;
