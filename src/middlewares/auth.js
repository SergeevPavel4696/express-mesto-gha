const jwt = require('jsonwebtoken');
const UnAuthorizedError = require('../errors/UnAuthorizedError');

const auth = (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    throw new UnAuthorizedError('Необходима вторизация' + req.toJson());
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
