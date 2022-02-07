import Router from "express";
import { celebrate, Joi } from 'celebrate';
import { isURL } from 'validator';

const usersRouter = new Router();

const {
  getUsers,
  getUser,
  updateProfile,
  updateAvatar,
  getMe,
} = require('../controllers/users');

usersRouter.get('/', getUsers);
usersRouter.get('/me', getMe);
usersRouter.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), updateProfile);
usersRouter.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().hex().length(24),
  }),
}), getUser);
usersRouter.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().pattern(/https?/).custom((value, helpers) => {
      if (isURL(value, { require_protocol: true })) {
        return value;
      }
      return helpers.error('any.invalid');
    }),
  }),
}), updateAvatar);

export default usersRouter;