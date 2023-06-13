const Card = require('../models/card');

const BadRequestError = require('../errors/bad-request-error');
const NotFoundError = require('../errors/not-found-error');
const ForbiddenError = require('../errors/forbidden-error');

// GET '/cards' - получение списка карточек
const getCards = async (req, res, next) => {
  try {
    const cards = await Card.find({});
    res.send(cards);
  } catch (err) {
    next(err); // 500
  }
};

// POST '/cards' - добавление новой карточки
const createCard = async (req, res, next) => {
  try {
    const card = await Card.create({
      name: req.body.name,
      link: req.body.link,
      owner: req.user._id,
    });
    res.status(201).send(card); // 201
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new BadRequestError('Переданы некорректные данные при создании карточки')); // 400
    } else {
      next(err); // 500
    }
  }
};

// DELETE '/cards/:cardId' - удаление моей карточки
const deleteCardById = (req, res, next) => {
  Card.findById(req.params.cardId)
    // если база возвращает пустой объект, то код дальше не выполняется, а переходит в catch
    .orFail(new NotFoundError('Карточка по указанному id не найдена')) // 404
    .then((card) => {
      // если поле id пользователя совпадает с полем владельца карточки - карточку удаляем
      if (String(req.user._id) === String(card.owner)) {
        Card.findByIdAndRemove(req.params.cardId)
          .then(() => res.send({ message: 'Карточка удалена' }))
          .catch(next);
      } else {
        throw new ForbiddenError('Можно удалять только собственные карточки'); // 403
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

// PUT '/cards/:cardId/likes' - лайк карточке
const likeCard = async (req, res, next) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
      { new: true },
    )
      .orFail(new NotFoundError('Передан несуществующий id карточки')); // 404
    res.send(card);
  } catch (err) {
    if (err.name === 'CastError') {
      next(new BadRequestError('Переданы некорректные данные для постановки лайка')); // 400
    } else {
      next(err); // 500
    }
  }
};

// DELETE '/cards/:cardId/likes' - удаление лайка карточки
const dislikeCard = async (req, res, next) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } }, // убрать _id из массива
      { new: true },
    )
      .orFail(new NotFoundError('Передан несуществующий id карточки')); // 404
    res.send(card);
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
