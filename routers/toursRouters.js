const express = require('express');
const tourController = require('./../controller/toursController');
const authController = require('./../controller/authController');
const reviewRouter = require('./../routers/reviewRouters');
const routers = express.Router();

//routers.param('id', tourController.checkID);
routers.use('/:tourId/reviews', reviewRouter);

routers
  .route('/top-5-cheap')
  .get(tourController.aliasTopTours, tourController.getAllTours);

routers.route('/tour-stats').get(tourController.getTourStats);

routers
  .route('/monthly-plan/:year')
  .get(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide', 'guide'),
    tourController.getMonthlyPlan
  );

//this route is for getting all tour within a certain distance
routers
  .route('/tours-within/:distance/center/:latlng/unit/:unit')
  .get(tourController.getDistances);

routers
  .route('/distance/:latlng/unit/:unit')
  .get(tourController.getToursWithin);

routers
  .route('/')
  .get(tourController.getAllTours)
  .post(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.createTour
  );
routers
  .route('/:id?')
  .get(tourController.getTour)
  .patch(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.uploadTourImages,
    tourController.resizeTourImages,
    tourController.updateTour
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.deleteTour
  );

module.exports = routers;
