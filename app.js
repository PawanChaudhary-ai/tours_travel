const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const hpp = require('hpp');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const tourRouter = require('./routers/toursRouters');
const userRouter = require('./routers/usersRouters');
const reviewRouter = require('./routers/reviewRouters');
const bookingRouter = require('./routers/bookingRouters');
const viewRouter = require('./routers/viewsRouters');
const globalErrorHandler = require('./controller/errorController');
const AppError = require('./utils/appError');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const authController = require('./controller/authController'); // Added this line
const app = express();
app.set('view engine', 'pug');
//app.set('views', `${__dirname}/views`);
app.set('views', path.join(__dirname, 'views'));

//Serving static files
//app.use(express.static(`${__dirname}/public`));
app.use(express.static(path.join(__dirname, 'public')));

// Parse cookies - Moving this before other middleware
app.use(cookieParser());

//Set security HTTP headers
app.use(
  helmet({
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: {
      allowOrigins: ['*']
    },
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'", 'data:', 'blob:', 'https:', 'ws:'],
        baseUri: ["'self'"],
        fontSrc: ["'self'", 'https:', 'data:'],
        scriptSrc: ["'self'", 'https:', 'blob:', "'unsafe-inline'"],
        styleSrc: ["'self'", 'https:', "'unsafe-inline'"],
        imgSrc: ["'self'", 'data:', 'blob:'],
        connectSrc: ["'self'", 'blob:', 'wss:']
      }
    }
  })
);

// Enable CORS
app.use(cors({
  origin: true,
  credentials: true
}));

app.options('*', cors({
  origin: true,
  credentials: true
}));

//Development logging
if (process.env.NODE_ENV !== 'development') {
  app.use(morgan('dev'));
}

//Limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!'
});
app.use('/api', limiter);

//Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

//Data sanitize against NoSQL query injection
app.use(mongoSanitize());

//Data sanitize against XSS
app.use(xss());

//Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price'
    ]
  })
);

//Custom middleware for testing
app.use((req, res, next) => {
  console.log('Hello from the middleware .');
  next();
});

app.use((req, res, next) => {
  console.log(process.env.NODE_ENV);
  req.requestTime = new Date().toISOString();
  next();
});

// Check if user is logged in
app.use(authController.isLoggedIn);

//Routes --------------------------------------------------
// View routes
app.use('/', viewRouter);

// Tours route
app.use('/api/v1/tours', tourRouter);

// Users route
app.use('/api/v1/users', userRouter);

// Review route
app.use('/api/v1/reviews', reviewRouter);

// Booking route
app.use('/api/v1/bookings', bookingRouter);

// Capture all unhandled routes
app.all('*', (req, res, next) => {
  next(new AppError(`Can not find ${req.originalUrl} on this server!`, 400));
});

//Global error handler
app.use(globalErrorHandler);

//Start server
module.exports = app;
