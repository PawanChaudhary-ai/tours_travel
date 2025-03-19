const Tour = require('./../models/tourModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const User = require('./../models/userModel');
const Booking = require('./../models/bookingModel');
const Review = require('./../models/reviewModel'); // Added Review model

exports.getOverview = catchAsync(async (req, res, next) => {
  // Get tour data from collection
  const tours = await Tour.find();

  if (!tours) {
    return next(new AppError('Tour details are not found.', 404));
  }

  // Render template using tour data from collection
  res.status(200).render('overview', {
    title: 'All Tours',
    tours: tours,
    user: res.locals.user // Explicitly pass user to the template
  });
});

exports.getLoginForm = catchAsync(async (req, res) => {
  res.status(200).render('login', {
    title: 'Log into your account',
    user: res.locals.user // Explicitly pass user to the template
  });
});

exports.getSignupForm = catchAsync(async (req, res) => {
  res.status(200).render('signup', {
    title: 'Create your account',
    user: res.locals.user // Explicitly pass user to the template
  });
});

exports.tourDetails = catchAsync(async (req, res, next) => {
  console.log('exports.tourDetails = catchAsync(async (req, res, next) => {');
  const tour = await Tour.findOne({ slug: req.params.slug })
    .populate({
      path: 'reviews',
      fields: 'review rating user'
    })
    .populate('guides')
    .populate({
      path: 'bookings',
      select: 'user'
    });

  if (!tour) {
    return next(new AppError('No tour found with that name', 404));
  }

  res.status(200).render('tour', {
    title: `${tour.name} Tour`,
    tour: tour,
    user: req.user || res.locals.user
  });
});

exports.getAccount = (req, res) => {
  res.status(200).render('account', {
    title: 'Your account'
  });
};

exports.updateUserData = catchAsync(async (req, res, next) => {
  console.log('No tour found with that name');
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      name: req.body.name,
      email: req.body.email
    },
    {
      new: true,
      runValidators: true
    }
  );

  res.status(200).render('account', {
    title: 'Your account',
    user: updatedUser
  });
});

exports.getMyTours = catchAsync(async (req, res, next) => {
  console.log('exports.getMyTours = catchAsync(async (req, res, next) => {');
  // 1) Find all bookings
  const bookings = await Booking.find({ user: req.user.id });

  // 2) Find tours with returned IDs
  const tourIDs = bookings.map(el => el.tour);
  const tours = await Tour.find({ _id: { $in: tourIDs }});
  res.status(200).render('overview', {
    title: 'My Tours',
    tours: tours
  });
});

exports.getMyReviews = catchAsync(async (req, res, next) => {
  // 1) Find all reviews by current user
  const reviews = await Review.find({ user: req.user.id }).populate({
    path: 'tour',
    select: 'name imageCover'
  });

  console.log('reviews -> ', reviews);

  // if (reviews.length === 0) {
  //   return next(new AppError('No reviews found.', 404));
  // }

  // 2) Render template
  res.status(200).render('my-reviews', {
    title: 'My Reviews',
    reviews
  });
});
