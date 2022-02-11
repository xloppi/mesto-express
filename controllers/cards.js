const Card = require("../models/card");
const ValidationError = require("../errors/validation-err.js");
const NotFoundError = require("../errors/not-found-err.js");
const ForbiddenError = require("../errors/forbidden-err.js")

const getCards = async (req, res, next) => {
  try {
    const cards = await Card.find({});
    return res.status(200).send(cards);
  } catch (err) {
    next(err);
  }
};

const createCard = async (req, res, next) => {
  try {
    const { name, link } = req.body;
    const card = await Card.create({ name, link, owner: req.user._id });

    return res.status(201).send(card);
  } catch (err) {
    if (err.name === "ValidationError") {
      return next(
        new ValidationError(
          "Переданы некорректные данные при создании карточки"
        )
      );
    }
    return next(err);
  }
};

const deleteCard = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const card = await Card.findById(req.params.cardId);

    if (!card) {
      return next(new NotFoundError("Карточка с указанным _id не найдена"));
    }

    if (userId !== card.owner.toString()) {
      return next(new ForbiddenError("Пользователь не является владельцем карточки"));
    }

    await Card.deleteOne({ _id: req.params.cardId });
    return res.status(200).send({ message: "карточка удалена" });
  } catch (err) {
    if (err.name === "CastError") {
      return next(new ValidationError("ошибка валидации cardID"));
    }
    return next(err);
  }
};

const likeCard = async (req, res, next) => {
  try {

  } catch (err) {

  }
}

// const likeCard = (req, res, next) => {
//   Card.findByIdAndUpdate(
//     req.params.cardId,
//     { $addToSet: { likes: req.user._id } },
//     { new: true },
//   )
//     .then((card) => {
//       if (card) {
//         res.status(200).send(card);
//       } else {
//         throw new NotFoundError('Карточка с указанным _id не найдена');
//       }
//     })
//     .catch((err) => {
//       if (err.name === 'CastError') {
//         return next(new ValidationError('Переданы некорректные данные для постановки лайка'));
//       }
//       return next(err);
//     });
// };

module.exports = {
  getCards,
  createCard,
  deleteCard,

};
