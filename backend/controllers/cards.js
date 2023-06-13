const Card = require('../models/card');

const BadRequestError = require('../errors/bad-request-error');
const NotFoundError = require('../errors/not-found-error');
const ForbiddenError = require('../errors/forbidden-error');

const getCards = async (req, res, next) => {
  try {
    const cards = await Card.find({});
    res.send(cards);
  } catch (err) {
    next(err); // 500
  }
};

const createCard = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const { name, link } = req.body;

    const card = await Card.create({ name, link, owner: _id });
    res.status(201).send(card); // 201
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new BadRequestError('Переданы некорректные данные при создании карточки')); // 400
    } else {
      next(err); // 500
    }
  }
};

const deleteCardById = (req, res, next) => {
  Card.findById(req.params.cardId)
    // если база возвращает пустой объект, то код дальше не выполняется, а переходит в catch
    .orFail(new NotFoundError('Карточка по указанному id не найдена')) // 404
    .then((card) => {
      // если поле id пользователя совпадает с полем владельца карточки - карточку удаляем
      if (String(req.user._id) === String(card.owner)) {
        Card.findByIdAndRemove(req.params.cardId)
          .then((deletedCard) => res.send(deletedCard))
          .catch(next);
      } else {
        throw new ForbiddenError('Нет пользовательских прав на удаление карточки'); // 403
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные при удалении карточки')); // 400
      } else {
        next(err); // 500
      }
    });
};

const likeCard = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const { cardId } = req.params;
    const card = await Card.findByIdAndUpdate(
      cardId,
      { $addToSet: { likes: _id } }, // добавить _id в массив, если его там нет
      { new: true },
    )
      .orFail(new NotFoundError('Передан несуществующий id карточки')); // 404
    res.send({ likes: card.likes });
  } catch (err) {
    if (err.name === 'CastError') {
      next(new BadRequestError('Переданы некорректные данные для постановки лайка')); // 400
    } else {
      next(err); // 500
    }
  }
};

const dislikeCard = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const { cardId } = req.params;
    const card = await Card.findByIdAndUpdate(
      cardId,
      { $pull: { likes: _id } }, // убрать _id из массива
      { new: true },
    )
      .orFail(new NotFoundError('Передан несуществующий id карточки')); // 404
    res.send({ likes: card.likes });
  } catch (err) {
    if (err.name === 'CastError') {
      next(new BadRequestError('Переданы некорректные данные для снятия лайка')); // 400
    } else {
      next(err); // 500
    }
  }
};

module.exports = {
  getCards,
  createCard,
  deleteCardById,
  likeCard,
  dislikeCard,
};
