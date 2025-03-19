const express = require('express');
const routers = express.Router();
const viewsController = require('./../controller/viewsController');
const authController = require('./../controller/authController');
const bookingController = require('./../controller/bookingController');

routers
  .route('/')
  .get(
    bookingController.createBookingCheckout,
    authController.isLoggedIn,
    viewsController.getOverview
  );

routers
  .route('/login')
  .get(authController.isLoggedIn, viewsController.getLoginForm);

routers.route('/signup').get(viewsController.getSignupForm);

routers
  .route('/tours/:slug')
  .get(authController.isLoggedIn, viewsController.tourDetails);

routers.route('/me').get(authController.protect, viewsController.getAccount);

routers
  .route('/my-tours')
  .get(authController.protect, viewsController.getMyTours);

routers
  .route('/submit-user-data')
  .post(authController.protect, viewsController.updateUserData);

routers
  .route('/my-reviews')
  .get(authController.protect, viewsController.getMyReviews);

module.exports = routers;
