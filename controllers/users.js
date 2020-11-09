const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-err');
const ConflictError = require('../errors/conflict-err');
const { CONFLICT_ERROR, USER_NOT_FOUND_ERROR } = require('../configs/constants');
const { SECRET_STR } = require('../configs/config');

const createUser = (req, res, next) => {
  const {
    email, password, name,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      email,
      password: hash,
      name,
    }))
    .catch((err) => {
      if (err.name === 'MongoError' && err.code === 11000) {
        throw new ConflictError(CONFLICT_ERROR);
      } else next(err);
    })
    .then((user) => res.send({ message: `Зарегистрирован пользователь ${user.email}` }))
    .catch(next);
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      // вернём токен
      res.send({
        token: jwt.sign({ _id: user._id }, SECRET_STR, { expiresIn: '7d' }),
      });
    })
    .catch(next);
};

const getUserMe = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError(USER_NOT_FOUND_ERROR);
      } else {
        res.send(user);
      }
    })
    .catch(next);
};

module.exports = {
  getUserMe,
  createUser,
  login,
};
