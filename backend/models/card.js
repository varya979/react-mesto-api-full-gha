const mongoose = require('mongoose');

const { regex } = require('../middlewares/celebrate-validation');

const cardSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 30,
    },
    link: {
      type: String,
      required: true,
      validate: {
        validator(v) {
          return regex.test(v);
        },
        message: (props) => `${props.value} некорректная ссылка`,
      },
    },
    owner: {
      /* Лучшая ссылка из одного документа на другой — идентификатор.
      Mongo автоматически создаёт поле `_id` — уникальный идентификатор
      для каждого документа. Этот идентификатор позволяет связать один документ с другим.
      Чтобы сделать это на уровне схемы, полю следует установить специальный тип —
      `mongoose.Schema.Types.ObjectId` и свойство `ref`. */
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    likes: [{ // список лайкнувших пост пользователей
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      default: [],
    }],
    createdAt: { // дата создания
      type: Date,
      default: Date.now,
    },
  },
  { versionKey: false }, /* чтобы убрать поле __v (версию документа)
  из объекта(наглядно - в постмане) */
);

module.exports = mongoose.model('card', cardSchema);
