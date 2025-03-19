const bookingController = require('./../controller/bookingController');
const authController = require('./../controller/authController');
const express = require('express');
const routers = express.Router();

routers.use(authController.protect);

routers
  .route('/checkout-session/:tourId')
  .get(bookingController.getCheckoutSession);

routers.use(authController.restrictTo('admin', 'lead-guide'));

routers
  .route('/')
  .get(bookingController.getAllBookings)
  .post(bookingController.createBooking);

routers
  .route('/:id')
  .get(bookingController.getBooking)
  .patch(bookingController.updateBooking)
  .delete(bookingController.deleteBooking);

module.exports = routers;
