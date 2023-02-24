const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRouter');
const viewRouter = require('./routes/viewRoutes');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const  hpp = require('hpp');

const app = express();
app.set('view engine','pug');
app.set('views',path.join(__dirname, 'views'));

// 1) flobal middlewares
//set security http headers
//serving 

// setting views/views engine
app.use(express.static(path.join(__dirname, 'public')));
// app.use(helmet());
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  })
);
  // {
  //   contentSecurityPolicy: false,
  //   crossOriginEmbedderPolicy: false,
  // }
// development longing
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
const limiter = rateLimit({
  max:100,
  windowMs:60 *60*1000,
  message:'to many request from this ip, please try again in an hour'
})
app.use('/api',limiter)
//body parser, reading data from body into req.body
app.use(express.json({limit: '10kb'}));
app.use(cookieParser())
// data sanitization against nosql query injection
app.use(mongoSanitize())
//data sanitiz against xs
//prevent patameter
app.use(hpp({
  whitelist: [
    'duration','ratingsQuantity','ratingsAverage','maxGroupSize','difficulty','price'
  ]
}))

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  console.log(req.cookies);
  next();
});

// 3) ROUTES

app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews',reviewRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
