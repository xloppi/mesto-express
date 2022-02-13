const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const ValidationError = require("../errors/validation-err.js");
const ConflictingError = require("../errors/conflicting-request-err");
const AuthError = require("../errors/auth-err");
const { NODE_ENV, JWT_SECRET_KEY, SALT_R } = require('../utils/conf');
const {
  USER_NOT_FOUND,
  INVALID_UPDATE_PROFILE,
  USER_ALREADY_EX,
  INVALID_DATA_USER,
  LOGIN_NOT_SUCCESS,
  LOGIN_SUCCESS,
  LOGOUT_SUCCESS,
} = require("../utils/const_messages");

const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    return res.status(200).send(users);
  } catch (err) {
    next(err);
  }
};

const getMe = async (req, res, next) => {
  try {
    const currentUser = await User.findById(req.user._id);

    if (currentUser) {
      res.status(200).send(currentUser);
    } else {
      return next(new NotFoundError(USER_NOT_FOUND));
    }
  } catch (err) {
    next(err);
  }
};

const createUser = async (req, res, next) => {
  try {
    const { name, about, avatar, email, password } = req.body;
    const hash = await bcrypt.hash(password, SALT_R);
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return next(new ConflictingError(USER_ALREADY_EX));
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
        new ValidationError(INVALID_DATA_USER)
      );
    }
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return next(new AuthError(LOGIN_NOT_SUCCESS));
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return next(new AuthError(LOGIN_NOT_SUCCESS));
    }

    const token = jwt.sign(
      { _id: user._id },
      JWT_SECRET_KEY,
      { expiresIn: "7d" }
    );

    return res
      .cookie("jwt", token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
        SameSite: "None",
        secure: false,
        secure: NODE_ENV === "production",
      })
      .send({ message: LOGIN_SUCCESS });
  } catch (err) {
    next(err);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { name: req.body.name, about: req.body.about },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return next(new NotFoundError(USER_NOT_FOUND));
    }

    return res.status(200).send(updatedUser);
  } catch (err) {
    if (err.name === "ValidationError" || err.name === "CastError") {
      return next(
        new ValidationError(INVALID_UPDATE_PROFILE)
      );
    }
    next(err);
  }
};

const updateAvatar = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { avatar: req.body.avatar },
      { new: true, runValidators: true }
    );

    if (!user) {
      return next(new NotFoundError(USER_NOT_FOUND));
    }

    res.status(200).send(user);
  } catch (err) {
    if (err.name === "ValidationError") {
      return next(
        new ValidationError(INVALID_UPDATE_PROFILE)
      );
    }
    next(err);
  }
};

const logout = (req, res) => res.clearCookie('jwt').send({ message: LOGOUT_SUCCESS });

module.exports = {
  getUsers,
  createUser,
  login,
  logout,
  updateProfile,
  updateAvatar,
  getMe,
};
