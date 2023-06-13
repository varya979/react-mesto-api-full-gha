const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/unauthorized-error');

module.exports = (req, res, next) => {
  // тут будет вся авторизация:
  const token = req.cookies.jwt; // достаём токен из кук с помощью куки-парсера в app.js

  let payload;

  try {
    // попытаемся верифицировать токен (прислал именно тот токен, который был выдан ему ранее):
    payload = jwt.verify(token, 'token-jwt'); // два параметра: токен и секретный ключ
    // Метод jwt.verify вернёт пейлоуд токена, если тот прошёл проверку
  } catch (err) {
    // отправим ошибку 401, если не получилось
    next(new UnauthorizedError('Передан неверный токен'));
  }

  req.user = payload; // записываем пейлоуд в объект запроса

  return next(); // пропускаем запрос дальше
};
