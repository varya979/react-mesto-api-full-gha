const NotFoundError = require('./not-found-error');

const incorrectRouter = (req, res, next) => {
  next(new NotFoundError('Указанный путь не существует'));
};

module.exports = incorrectRouter;
