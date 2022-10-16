const jwt = require('jsonwebtoken');
const UnAuthorizedError = require('../errors/UnAuthorizedError');

const auth = (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    throw new UnAuthorizedError('Необходимаавторизация');
  }
  let payload;
  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    throw new UnAuthorizedError('Необходима авторизация');
  }
  req.user = payload;
  next();
};

module.exports = auth;
