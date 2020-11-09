const jwt = require('jsonwebtoken');
const AuthorizationError = require('../errors/authorization-err');
const { AUTHORIZATION_ERROR } = require('../configs/constants');
const { SECRET_STR } = require('../configs/config');

const auth = (req, res, next) => {
  // достаём авторизационный заголовок
  const { authorization } = req.headers;
  // убеждаемся, что он есть и начинается с Bearer
  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new AuthorizationError(AUTHORIZATION_ERROR);
  }
  // извлечём токен
  const token = authorization.replace('Bearer ', '');

  let payload;

  try {
    // попытаемся верифицировать токен
    payload = jwt.verify(token, SECRET_STR);
  } catch (err) {
    // отправим ошибку, если не получилось
    throw new AuthorizationError(AUTHORIZATION_ERROR);
  }

  req.user = payload; // записываем пейлоуд в объект запроса

  next(); // пропускаем запрос дальше
};

module.exports = {
  auth,
};
