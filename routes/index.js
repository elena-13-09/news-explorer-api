const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { auth } = require('../middlewares/auth');
const users = require('./users');
const articles = require('./articles');
const { createUser, login } = require('../controllers/users');
const NotFoundError = require('../errors/not-found-err');
const { PAGE_NOT_FOUND_ERROR } = require('../configs/constants');

router.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6),
    name: Joi.string().required().min(2).max(30),
  }).unknown(true),
}), createUser);

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6),
  }),
}), login);

router.use(auth); // все роуты ниже этой строки будут защищены
router.use('/users', users);
router.use('/articles', articles);
router.use((req, res, next) => {
  next(new NotFoundError(PAGE_NOT_FOUND_ERROR));
});

module.exports = router;
