const reviewController = require('./../controller/reviewController');
const authController = require('./../controller/authController');
const express = require('express');
const routers = express.Router({ mergeParams: true });

routers.use(authController.protect);

routers
  .route('/')
  .get(reviewController.getAllReviews)
  .post(
    authController.restrictTo('user'),
    reviewController.setTourUserIds,
    reviewController.createReview
  );

routers
  .route('/:id')
  .get(reviewController.getReview)
  .patch(
    authController.restrictTo('user', 'admin'),
    reviewController.updateReview
  )
  .delete(
    authController.restrictTo('admin', 'lead-guide'),
    reviewController.deleteReview
  );

module.exports = routers;
