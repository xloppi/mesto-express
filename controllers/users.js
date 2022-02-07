const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

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

// const createUser = (req, res, next) => {
//   const {
//     name,
//     about,
//     avatar,
//     email,
//     password,
//   } = req.body;

//   return bcrypt.hash(password, NODE_ENV === 'production' ? Number(SALT_ROUNDS) : 10, (error, hash) => {
//     User.findOne({ email })
//       .then((userEmail) => {
//         if (userEmail) {
//           throw new ConflictingError('Такой пользователь уже существует');
//         }

//         return User.create({
//           name,
//           about,
//           avatar,
//           email,
//           password: hash,
//         })
//           .then((user) => {
//             const newUser = user.toObject();
//             delete newUser.password;
//             res.status(201).send(newUser);
//           });
//       })
//       .catch((err) => {
//         if (err.name === 'ValidationError' || err.name === 'CastError') {
//           return next(new ValidationError('Переданы некорректные данные при создании пользователя'));
//         }
//         return next(err);
//       });
//   });
// };

module.exports = {
  getUsers,
  createUser,
};
