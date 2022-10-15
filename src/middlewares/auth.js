const jwt = require('jsonwebtoken');
const UnAuthorizedError = require('../errors/UnAuthorizedError');

const auth = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new UnAuthorizedError('Необходимаавторизация'));
  }
  const token = authorization.replace('Bearer ', '');
  try {
    req.user = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    return next(new UnAuthorizedError('Необходима авторизация'));
  }
  return next();
};

module.exports = auth;
