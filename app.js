const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Load routes
const requestRouter = require('./routes/requestRoutes');
const userRouter = require('./routes/userRoutes');
const commentRouter = require('./routes/commentRoutes');
const viewRouter = require('./routes/viewRoutes');
const cookieParser = require('cookie-parser');

// GLOBAL MIDDLEWARES
app.use(express.static(path.join(__dirname, 'public')));

// Set security
app.use(helmet());

// Body parser
app.use(express.json({ limit: '10kb' }));

// Cookie parser middleware
app.use(cookieParser());

// Data Sanization against NOSQL injections
app.use(mongoSanitize());

// Data Sanization agains XSS
app.use(xss());

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Limit request from the same API
const limiter = rateLimit({
  max: 100,
  windowsMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour',
});

app.use('/api', limiter);

// Prevent parameter polution
app.use(hpp());

// app.set()

app.use('/api/v1/requests', requestRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/comments', commentRouter);
app.use('/', viewRouter);

app.all('*', (req, res, next) => {
  // res.status(404).json({
  //   status: 'fail',
  //   message: `${req.originalUrl} not found on this server!`
  // });

  next(new AppError(`${req.originalUrl} not found on this server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
