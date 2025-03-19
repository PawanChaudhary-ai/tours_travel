const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const APIFeatures = require('./../utils/apiFeatures');

const getFilteredBody = body => {
  const filteredBody = {};

  filteredBody.name = body.name;
  filteredBody.email = body.email;

  return filteredBody;
};

exports.deleteOne = Model =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }

    res.status(204).json({
      status: 'success',
      data: null
    });
  });

exports.updateOne = Model =>
  catchAsync(async (req, res, next) => {
    //Create error if user POST password data
    if (req.body.password || req.body.passwordConfirm) {
      return next(
        new AppError(
          'This route is not for password updates. Please use /updateMyPassword.',
          400
        )
      );
    }

    //Filter out unwanted fields
    const filteredBody = getFilteredBody(req.body);

    //Update user document
    const doc = await Model.findByIdAndUpdate(req.user.id, filteredBody, {
      new: true,
      runValidators: true
    });

    //Send response
    res.status(200).json({
      status: 'success',
      data: {
        data: doc
      }
    });
  });

exports.createOne = Model =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        data: doc
      }
    });
  });

exports.getTour = catchAsync(async (req, res, next) => {
  console.log('exports.getTour = catchAsync(async (req, res, next) => {');
  const tour = await Tour.findById(req.params.id)
  .populate({
    path:'bookings',
    select: 'tour user price'
  })
    .populate({
      path: 'reviews',
      populate: {
        path: 'users',
        select: 'name email photo'
      }
    })
    .populate({
      path: 'guides',
      select: 'name photo role'
    });

  if (!tour) {
    return next(new AppError('No tour found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour
    }
  });
});

exports.getDocument = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    console.log('exports.getDocument = (Model, popOptions) =>');
    let query = Model.findById(req.params.id);
    if (popOptions) {
      query = query.populate(popOptions);
    }
    const doc = await query;

    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: doc
      }
    });
  });

exports.getAllDocuments = Model =>
  catchAsync(async (req, res, next) => {
    console.log('exports.getAllDocuments = Model =>');
    //To allow nested GET reviews on tour (a small hack)
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };

    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .filter();

    //This line of code the return the execution Stats
    //const doc = await features.query.explain();
    const doc = await features.query;

    //Send response
    res.status(200).json({
      status: 'success',
      results: doc.length,
      data: {
        data: doc
      }
    });
  });
