const cardRouter = require('express').Router();

const {
  getCards,
  createCard,
  deleteCardById,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

const { createCardValidation, cardIdValidation } = require('../middlewares/celebrate-validation');

cardRouter.get('/cards', getCards);
cardRouter.post('/cards', createCardValidation, createCard);
cardRouter.delete('/cards/:cardId', cardIdValidation, deleteCardById);
cardRouter.put('/cards/:cardId/likes', cardIdValidation, likeCard);
cardRouter.delete('/cards/:cardId/likes', cardIdValidation, dislikeCard);

module.exports = cardRouter;
