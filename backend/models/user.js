const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const UnauthorizedError = require('../errors/unauthorized-error');
const { regex } = require('../middlewares/celebrate-validation');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      minlength: 2,
      maxlength: 30,
      default: 'Жак-Ив Кусто', // Mongoose only applies a default if the value of the path is strictly undefined
    },
    about: {
      type: String,
      minlength: 2,
      maxlength: 30,
      default: 'Исследователь',
    },
    avatar: {
      type: String,
      default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
      validate: {
        validator(v) {
          return regex.test(v);
        },
        message: (props) => `${props.value} некорректная ссылка`,
      },
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: (v) => validator.isEmail(v),
        message: 'Некорректный адрес электронной почты',
      },
    },
    password: {
      type: String,
      required: true,
      select: false, // по умолчанию хеш пароля пользователя не будет возвращаться из базы
    },
  },
  { versionKey: false }, /* чтобы убрать поле __v (версию документа)
  из объекта(наглядно - в постмане) */
);

// сделаем код проверки почты и пароля частью схемы User:
// добавим метод findUserByCredentials схеме пользователя.
// у него будет два параметра — почта и пароль

// eslint-disable-next-line func-names
userSchema.statics.findUserByCredentials = function (email, password) {
  // попытаемся найти пользователя по почте
  return this.findOne({ email }).select('+password')
  // this — это модель User
    .then((user) => {
      // не нашёлся — отклоняем промис
      if (!user) {
        return Promise.reject(new UnauthorizedError('Неправильные почта или пароль')); // 401
      }

      // нашёлся — сравниваем хеши
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) { // отклоняем промис
            return Promise.reject(new UnauthorizedError('Неправильные почта или пароль')); // 401
          }

          return user; // теперь user доступен
        });
    });
};

module.exports = mongoose.model('user', userSchema);
