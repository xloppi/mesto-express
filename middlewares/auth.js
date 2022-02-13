const jwt = require('jsonwebtoken');
const AuthError = require('../errors/auth-err');

const { JWT_SECRET_KEY } = require('../utils/conf');

const { AUTH_ERR } = require('../utils/const_messages.js');

module.exports = (req, res, next) => {
  const cookie = req.cookies.jwt;

  if (!cookie) {
    return next(new AuthError("1"));
  }

  let payload;

  try {
    payload = jwt.verify(cookie, JWT_SECRET_KEY);
  } catch (err) {
    return next(new AuthError("2"));
  }

  req.user = payload;

  return next();
};