const jwt = require('jsonwebtoken');

const unAuthorized = 401;

const auth = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    res.status(unAuthorized).send({ message: 'Необходимаавторизация' });
  } else {
    const token = authorization.replace('Bearer ', '');
    try {
      req.user = jwt.verify(token, 'some-secret-key');
    } catch (err) {
      res.status(unAuthorized).send({ message: 'Необходима авторизация' });
    }
    next();
  }
};

module.exports = auth;
