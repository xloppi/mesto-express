const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const ValidationError = require('../errors/validation-err.js');
const ConflictingError = require('../errors/conflicting-request-err');

const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    return res.status(200).send(users);
  } catch (err) {
    next(err);
  }
};

const createUser = async (req, res, next) => {
  try {
    const { name, about, avatar, email, password } = req.body;
    const hash = await bcrypt.hash(password, 10);
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return next(new ConflictingError("Такой пользователь уже существует"));
    }

    const newUser = await User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    });

    const user = newUser.toObject();
    delete user.password;
    res.status(201).send(user);
  } catch (err) {
    console.log(123)
    if (err.name === "ValidationError" || err.name === "CastError") {
      return next(
        new ValidationError(
          "Переданы некорректные данные при создании пользователя"
        )
      );
    }
    return next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
  } catch (err) {
    next();
  }
}

// const login = (req, res, next) => {
//   const { email, password } = req.body;

//   return User.findOne({ email }).select('+password')
//     .then((user) => {
//       if (!user) {
//         throw next(new AuthError('Не правильная почта или пароль'));
//       }

//       return bcrypt.compare(
//         password,
//         user.password,
//         (error, isValid) => {
//           if (!isValid) {
//             throw next(new AuthError('Не правильная почта или пароль'));
//           }

//           const token = jwt.sign(
//             { _id: user._id },
//             NODE_ENV === 'production' ? JWT_SECRET : 'superpupernikogdanepodbereshkey',
//             { expiresIn: '7d' },
//           );
//           return res
//             .cookie('jwt', token, {
//               maxAge: 3600000 * 24 * 7,
//               httpOnly: true,
//               SameSite: 'None',
//               secure: true,
//             })
//             .send({ message: 'Авторизация прошла успешно' });
//         },
//       );
//     })
//     .catch(next);
// };

module.exports = {
  getUsers,
  createUser,
};
