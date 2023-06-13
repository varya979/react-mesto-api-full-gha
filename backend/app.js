const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');
const incorrectRouter = require('./errors/incorrect-router');
const { login, registration } = require('./controllers/users');
const auth = require('./middlewares/auth');
const error = require('./middlewares/error-handler');
const { registrationValidation, loginValidation } = require('./middlewares/celebrate-validation');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 3000 } = process.env;
const app = express();
app.use(cors());

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
// подключаем логгер запросов
app.use(requestLogger);

// краш-тест. Удалить после ревью
app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

// роуты не требующие авторизации:
app.post('/signup', registrationValidation, registration);
app.post('/signin', loginValidation, login);
// авторизация для всего приложения:
app.use(auth);
// роуты, которым авторизация нужна:
app.use('/', userRouter);
app.use('/', cardRouter);
app.use('*', incorrectRouter);
// подключаем логгер ошибок
app.use(errorLogger);
// мидлвэр - обработчик ошибок celebrate
app.use(errors());
// мидлвэр - центральный обработчик ошибок (должен быть в конце всех app.use):
app.use(error);

app.listen(PORT);
