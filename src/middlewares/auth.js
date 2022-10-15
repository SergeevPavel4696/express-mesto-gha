const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    res.send('Необходима авторизация');
  } else {
    const token = authorization.replace('Bearer ', '');
    try {
      req.user = jwt.verify(token, 'some-secret-key');
    } catch (err) {
      res.send('Необходима авторизация');
    }
    next();
  }
};

module.exports = auth;
