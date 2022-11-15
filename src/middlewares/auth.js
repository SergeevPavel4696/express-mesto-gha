const jwt = require('jsonwebtoken');
const UnAuthorizedError = require('../errors/UnAuthorizedError');

const { NODE_ENV, JWT_SECRET } = process.env;

const auth = (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    throw new UnAuthorizedError('Необходимаавторизация');
  }
  let payload;
  try {
    payload = jwt.verify(token, `${NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret'}`);
  } catch (err) {
    next(new UnAuthorizedError('Необходима авторизация'));
  }
  req.user = payload;
  next();
};

module.exports = auth;
