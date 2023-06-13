/* 401
Отсутствие токена (JWT), некорректный токен (JWT),
невалидный пароль - Unauthorized */

class UnauthorizedError extends Error {
  constructor(message) {
    super(message);
    this.name = 'UnauthorizedError';
    this.statusCode = 401;
  }
}

module.exports = UnauthorizedError;
