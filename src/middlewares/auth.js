const jwt = require('jsonwebtoken');
const UnAuthorizedError = require('../errors/UnAuthorizedError');

const auth = (req, res, next) => {
  const { Authorization } = req.headers;
  if (!Authorization || !Authorization.startsWith('Bearer ')) {
    next(new UnAuthorizedError('Необходимаавторизация'));
  } else {
    const token = Authorization.replace('Bearer ', '');
    let payload;
    try {
      payload = jwt.verify(token, 'some-secret-key');
    } catch (err) {
      next(new UnAuthorizedError('Необходима авторизация'));
    }
    req.user = payload;
    next();
  }
};

module.exports = auth;
