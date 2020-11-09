const mongoose = require('mongoose');
// Для хеширования пароля
const bcrypt = require('bcryptjs');
const isEmail = require('validator/lib/isEmail');
const AuthorizationError = require('../errors/authorization-err');
const { INCORRECT_DATA_ERROR } = require('../configs/constants');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (v) => isEmail(v), message: 'Неправильный формат почты',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
}, { versionKey: false });

userSchema.statics.findUserByCredentials = function (email, password) {
  // попытаемся найти пользователя по почте
  return this.findOne({ email }).select('+password')
    .then((user) => {
      // не нашёлся — отклоняем промис
      if (!user) {
        throw new AuthorizationError(INCORRECT_DATA_ERROR);
      }
      // нашёлся — сравниваем хеши
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new AuthorizationError(INCORRECT_DATA_ERROR);
          }

          return user; // теперь user доступен
        });
    });
};

module.exports = mongoose.model('user', userSchema);
