const cardsRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { isURL } = require('validator');

const {
  getCards,
  // createCard,
  // deleteCard,
  // likeCard,
  // dislikeCard,
} = require('../controllers/cards');

cardsRouter.get('/', getCards);
// cardsRouter.post('/', celebrate({
//   body: Joi.object().keys({
//     name: Joi.string().required().min(2).max(30),
//     link: Joi.string().required().pattern(/https?/).custom((value, helpers) => {
//       if (isURL(value, { require_protocol: true })) {
//         return value;
//       }
//       return helpers.error('any.invalid');
//     }),
//   }),
// }), createCard);
// cardsRouter.delete('/:cardId', celebrate({
//   params: Joi.object().keys({
//     cardId: Joi.string().hex().length(24),
//   }),
// }), deleteCard);
// cardsRouter.put('/:cardId/likes', celebrate({
//   params: Joi.object().keys({
//     cardId: Joi.string().hex().length(24),
//   }),
// }), likeCard);
// cardsRouter.delete('/:cardId/likes', celebrate({
//   params: Joi.object().keys({
//     cardId: Joi.string().hex().length(24),
//   }),
// }), dislikeCard);

module.exports = cardsRouter;