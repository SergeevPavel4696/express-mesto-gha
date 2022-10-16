const jwt = require('jsonwebtoken');
const UnAuthorizedError = require('../errors/UnAuthorizedError');

const auth = (req, res, next) => {
  let { token } = req.cookies;
  const { Authorization } = req.headers;
  if (!token && (!Authorization || !Authorization.startsWith('Bearer '))) {
    throw new UnAuthorizedError('Необходимаавторизация');
  }
  if (!token) {
    token = Authorization.replace('Bearer ', '');
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
