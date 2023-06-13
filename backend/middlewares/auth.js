const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/unauthorized-error');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer')) {
    return next(new UnauthorizedError('Проблема с авторизацией')); // 401
  }
  const token = authorization.replace('Bearer ', '');

  let payload;

  try {
    // попытаемся верифицировать токен (прислал именно тот токен, который был выдан ему ранее):
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
    // Метод jwt.verify вернёт пейлоуд токена, если тот прошёл проверку
  } catch (err) {
    // отправим ошибку 401, если не получилось
    return next(new UnauthorizedError('Проблема с авторизацией'));
  }

  req.user = payload; // записываем пейлоуд в объект запроса

  return next(); // пропускаем запрос дальше
};
