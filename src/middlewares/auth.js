const jwt = require('jsonwebtoken');
const UnAuthorizedError = require('../errors/UnAuthorizedError');

const auth = (req, res, next) => {
  const { authorization } = req.headers;
  let token = req.cookies.jwt;
  if ((!authorization || !authorization.startsWith('Bearer ')) && !token) {
    throw new UnAuthorizedError('Необходимаавторизация');
  } else if (authorization && authorization.startsWith('Bearer ')) {
    token = authorization.replace('Bearer ', '');
  }
  let payload;
  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    next(new UnAuthorizedError('Необходима авторизация'));
  }
  req.user = payload;
  next();
};

module.exports = auth;
