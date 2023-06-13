const express = require('express');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const bodyParser = require('body-parser');
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');
const incorrectRouter = require('./errors/incorrect-router');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const error = require('./middlewares/error-handler');
const { createUserValidation, loginValidation } = require('./middlewares/celebrate-validation');

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser()); // подключаем парсер кук как мидлвэр

// роуты не требующие авторизации:
app.post('/signup', createUserValidation, createUser);
app.post('/signin', loginValidation, login);
// авторизация для всего приложения:
app.use(auth);
// роуты, которым авторизация нужна:
app.use('/', userRouter);
app.use('/', cardRouter);
app.use('*', incorrectRouter);
// мидлвэр - обработчик ошибок celebrate
app.use(errors());
// мидлвэр - центральный обработчик ошибок (должен быть в конце всех app.use):
app.use(error);

app.listen(PORT);
