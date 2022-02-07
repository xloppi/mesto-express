const router = require('express').Router();
const usersRoutes = require('./users');
const cardsRoutes = require('./cards');

router.use('/users', usersRoutes);
router.use('/cards', cardsRoutes);
//router.use('/', (req, res, next) => next(new NotFoundError('Запрашиваемый ресурс не найден')));

module.exports = router;