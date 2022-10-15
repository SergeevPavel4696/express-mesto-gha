const errorHandler = (err, req, res, next) => {
  const { statusCode, message } = err;
  res.status(statusCode).send({ message: statusCode === 500 ? 'Сервер не работает' : message });
  next();
};

module.exports = errorHandler;
