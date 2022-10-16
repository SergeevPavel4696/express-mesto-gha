const jwt = require('jsonwebtoken');
const UnAuthorizedError = require('../errors/UnAuthorizedError');

const auth = (req, res, next) => {
  let { token } = req.cookies;
  const { authorization } = req.headers;
  if (!token && (!authorization || !authorization.startsWith('Bearer '))) {
    throw new UnAuthorizedError('Необходимаавторизация');
  }
  if (!token) {
    token = authorization.replace('Bearer ', '');
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
