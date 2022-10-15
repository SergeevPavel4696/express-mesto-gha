const jwt = require('jsonwebtoken');
const UnAuthorizedError = require('../errors/UnAuthorizedError');

const auth = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(new UnAuthorizedError('Необходима авторизация'));
  } else {
    const token = authorization.replace('Bearer ', '');
    try {
      req.user = jwt.verify(token, 'some-secret-key');
    } catch (err) {
      next(new UnAuthorizedError('Необходима авторизация'));
    }
    next();
  }
};

module.exports = auth;
