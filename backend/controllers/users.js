const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const { NODE_ENV, JWT_SECRET } = process.env;

const BadRequestError = require('../errors/bad-request-error');
const NotFoundError = require('../errors/not-found-error');
const ConflictError = require('../errors/conflict-error');

// POST '/signup' - регистрация (создание) пользователя
const registration = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash, // записываем хэш в базу
    }))
    .then((user) => res.status(201).send({ // 201
      name, about, avatar, _id: user._id, email,
    }))
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictError('Такой пользователь уже существует')); // 409
      } else if (err.name === 'ValidationError') {
        next(new BadRequestError('Передан некорректные данные пользователя')); // 400
      } else {
        next(err); // 500
      }
    });
};

// POST '/signin' - авторизация пользователя
const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
    // аутентификация успешна! пользователь в переменной user
      // Методом sign создаем токен. Методу мы передали три аргумента
      const token = jwt.sign(
        { _id: user._id }, // пейлоуд токена (зашифрованный в строку объект пользователя) - id
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', // секретный ключ подписи
        { expiresIn: '7d' }, // время, в течение которого токен остаётся действительным
      );
      res.status(200).send({ token });
    })
    // ошибка невалидного логина или пароля обрабатывается в схеме пользователя
    .catch(next); // 401 и 500
};

// GET '/users' - получение списка пользователей
const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    next(err); // 500
  }
};

// GET '/users/:userId' - получение пользователя по id
const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId)
    // если база возвращает пустой объект, то код дальше не выполняется, а переходит в catch
      .orFail(new NotFoundError('Пользователь по указанному id не найден')); // 404
    res.send(user);
  } catch (err) {
    next(err); // 500
  }
};

// GET '/users/me' - получение моего пользователя
const getMyUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)
      .orFail(new NotFoundError('Пользователь по указанному id не найден')); // 404
    res.send(user);
  } catch (err) {
    next(err); // 500
  }
};

// PATCH '/users/me' - обвновление моего профиля
const updateUserProfile = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        name: req.body.name,
        about: req.body.about,
      },
      { new: true, runValidators: true }, // получим обновлённую и валидную запись
    )
      .orFail(new NotFoundError('Пользователь c указанным id не найден')); // 404
    res.send(user);
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new BadRequestError('Переданы некорректные данные при обновлении профиля')); // 400
    } else {
      next(err); // 500
    }
  }
};

// PATCH '/users/me/avatar' - обвновление моего аватара
const updateUserAvatar = async (req, res, next) => {
  try {
    const { avatar } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user,
      { avatar },
      { new: true, runValidators: true },
    )
      .orFail(new NotFoundError('Пользователь c указанным id не найден')); // 404
    res.send(user);
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new BadRequestError('Переданы некорректные данные при обновлении аватара')); // 400
    } else {
      next(err); // 500
    }
  }
};

module.exports = {
  getUsers,
  getUser,
  registration,
  updateUserProfile,
  updateUserAvatar,
  login,
  getMyUser,
};
