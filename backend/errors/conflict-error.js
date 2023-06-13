/* 409
зарегистрировать вторую учетную запись на тот же email - Conflict */

class ConflictError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ConflictError';
    this.statusCode = 409;
  }
}

module.exports = ConflictError;
