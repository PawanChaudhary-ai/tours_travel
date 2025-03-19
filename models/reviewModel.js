const mongoose = require('mongoose');
const Tour = require('./tourModel');
const AppError = require('./../utils/appError');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Review can not be empty!']
    },
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must belong to a tour.']
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user.']
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

reviewSchema.pre(/^find/, async function(next) {
  //   this.populate({
  //     path: 'tour',
  //     select: 'name'
  //   }).populate({
  //     path: 'user',
  //     select: 'name photo'
  //   });
  this.populate({
    path: 'user',
    select: 'name email photo'
  });
  next();
});

reviewSchema.statics.calcAverageRatings = async function(tourId) {
  const stats = await this.aggregate([
    { $match: { tour: tourId } },
    {
      $group: {
        _id: '$tour',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' }
      }
    }
  ]);
  if (stats.length > 0) {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avgRating
    });
  } else {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5
    });
  }
};

reviewSchema.post('save', async function() {
  //await this.constructor.calcAverageRatings(this.tour);
  const averageRatings = await Review.calcAverageRatings(this.tour);
});

reviewSchema.pre(/^findOneAnd/, async function(next) {
  //We can not use post here because in post the query already has been executed and query is no longer available.
  this.r = await this.findOne();
  if (!this.r) return next(new AppError('No document found with that ID', 404));
  next();
});

reviewSchema.post(/^findOneAnd/, async function() {
  //this.r = await this.findOne(); This does not work here because the query has already been executed.
  await this.r.constructor.calcAverageRatings(this.r.tour);
  //await Review.calcAverageRatings(this.r.tour);
  console.log('.....................1');
  console.log(this.r);
  console.log('.....................2');
});

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
