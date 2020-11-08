require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const routes = require('./routes/index');
const { limiter } = require('./middlewares/rate-limit');
const { CentralizedErrorHandler } = require('./middlewares/centralized-error-handler');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { SERVER_DB, PORT } = require('./configs/config');

const app = express();
// подключаемся к серверу mongo
mongoose.connect(SERVER_DB, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(cors());
app.use(limiter);// ограничение количества запросов
app.use(helmet());// для установки заголовков, связанных с безопасностью
app.use(bodyParser.json()); // для собирания JSON-формата
app.use(bodyParser.urlencoded({ extended: true })); // для приёма веб-страниц внутри POST-запроса
app.use(requestLogger); // подключаем логгер запросов
app.use(routes);
app.use(errorLogger); // подключаем логгер ошибок
app.use(errors()); // обработчик ошибок celebrate
app.use(CentralizedErrorHandler);
app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});
