/* 403
Обновление чужого профиля, чужого аватара, удаление чужой
карточки - Authorized but Forbidden */

class ForbiddenError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ForbiddenError';
    this.statusCode = 403;
  }
}

module.exports = ForbiddenError;
