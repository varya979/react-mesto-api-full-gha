const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const BadRequestError = require('../errors/bad-request-error');
const NotFoundError = require('../errors/not-found-error');
const ConflictError = require('../errors/conflict-error');

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash, // записываем хэш в базу
    }))
    .then((user) => res.status(201).send({ // 201
      name, about, avatar, email, _id: user._id,
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

const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
    // аутентификация успешна! пользователь в переменной user
      // Методом sign создаем токен. Методу мы передали три аргумента
      const token = jwt.sign(
        { _id: user._id }, // пейлоуд токена (зашифрованный в строку объект пользователя) - id
        'token-jwt', // секретный ключ подписи
        { expiresIn: '7d' }, // время, в течение которого токен остаётся действительным
      );
      // записываем токен в куки браузера
      res.cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7, // срок жизни куки
        httpOnly: true, // куки нельзя прочесть из JavaScript
      });
      // вернём токен
      // если здесь убрать возврат токена - идет бесконечный запрос и токен не возвращается
      res.send({ token });
    })
    // ошибка невалидного логина или пароля обрабатывается в схеме пользователя
    .catch(next); // 401 и 500
};

const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    next(err); // 500
  }
};

const getUserById = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId)
    // если база возвращает пустой объект, то код дальше не выполняется, а переходит в catch
      .orFail(new NotFoundError('Пользователь по указанному id не найден')); // 404
    res.send(user);
  } catch (err) {
    if (err.name === 'CastError') {
      next(new BadRequestError('Передан некорректный id пользователя')); // 400
    } else {
      next(err); // 500
    }
  }
};

const getMyUsersInfo = async (req, res, next) => {
  try {
    const { _id } = req.user;

    const user = await User.findById(_id)
      .orFail(new NotFoundError('Пользователь по указанному id не найден')); // 404
    res.send(user);
  } catch (err) {
    if (err.name === 'CastError') {
      next(new BadRequestError('Передан некорректный id пользователя')); // 400
    } else {
      next(err); // 500
    }
  }
};

const updateUserProfile = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const { name, about } = req.body;
    const user = await User.findByIdAndUpdate(
      _id,
      { name, about },
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

const updateUserAvatar = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const { avatar } = req.body;

    const user = await User.findByIdAndUpdate(
      _id,
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
  getUserById,
  createUser,
  updateUserProfile,
  updateUserAvatar,
  login,
  getMyUsersInfo,
};
