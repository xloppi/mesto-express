const router = require('express').Router();
const usersRoutes = require('./users');
const cardsRoutes = require('./cards');
const auth = require('../middlewares/auth');
const NotFoundError = require('../errors/not-found-err')
const { celebrate, Joi } = require('celebrate');
const { isURL, isEmail } = require('validator');
const { createUser, login } =require('../controllers/users');

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi
      .string()
      .required()
      .custom((value, helpers) => {
        if (isEmail(value)) {
          return value;
        }
        return helpers.error('any.invalid');
      }),
    password: Joi.string().required(),
  }),
}), login);

router.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(/https?/).custom((value, helpers) => {
      if (isURL(value, { require_protocol: true })) {
        return value;
      }
      return helpers.error('any.invalid');
    }),
    email: Joi.string().required().email(),
    password: Joi.string(),
  }),
}), createUser);

router.use(auth);

router.use('/users', usersRoutes);
router.use('/cards', cardsRoutes);
router.use('/', (req, res, next) => next(new NotFoundError('Запрашиваемый ресурс не найден')));

module.exports = router;