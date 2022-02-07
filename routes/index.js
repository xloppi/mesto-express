import { Router } from "express";
import usersRouter from "./cards";
import cardsRouter from "./cards";

const router = new Router();

router.use('/users', userRoutes);
router.use('/cards', cardRoutes);
//router.use('/', (req, res, next) => next(new NotFoundError('Запрашиваемый ресурс не найден')));

export default router;