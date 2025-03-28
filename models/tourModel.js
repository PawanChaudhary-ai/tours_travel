const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');
const User = require('./userModel');
const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name.'],
      unique: true,
      maxlength: [
        40,
        'A tour name must have less or equal then 40 characters.'
      ],
      minlength: [
        10,
        'A tour name must have more or equal then 10 characters.'
      ],
      trim: true
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration.']
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size.']
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty.'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty is either: easy, medium, difficult'
      }
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
      set: val => Math.round(val * 10) / 10
    },
    ratingsQuantity: {
      type: Number,
      default: 0
    },
    rating: {
      type: Number,
      default: 4.5
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price.']
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function(val) {
          //this only points to current doc on NEW document creation
          return val < this.price;
        },
        message: 'Discount price ({VALUE}) should be below regular price'
      }
    },
    summary: {
      type: String,
      required: [true, 'A tour must have a summary.'],
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image.']
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now()
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: true
    },
    startLocation: {
      //GeoJSON
      type: {
        type: String, // Don't do { type: 'Point' }
        default: 'Point',
        enum: ['Point']
      },
      coordinates: [Number],
      address: String,
      description: String
    },
    locations: [
      {
        type: {
          type: String, // Don't do { type: 'Point' }
          default: 'Point',
          enum: ['Point']
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number
      }
    ],
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
      }
    ]
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

//Creating index on price field
//tourSchema.index({ price: 1 });
tourSchema.index({ price: 1, ratingsAverage: -1 });
tourSchema.index({ slug: 1 });
tourSchema.index({ coordinates: '2dsphere' });

tourSchema.virtual('durationWeeks').get(function() {
  return this.duration / 7;
});

// Virtual populate for reviews
tourSchema.virtual('reviews', {
  ref: 'Review', // Model to populate
  foreignField: 'tour', // Field in Review model that references Tour
  localField: '_id' // Field in Tour model
});

tourSchema.virtual('bookings', {
  ref: 'Booking', // Model to populate
  foreignField: 'tour', // Field in Tour model that references Tour
  localField: '_id' // Field in Tour model
});

//Document middleware: runs before .save() and .create()
//This will not run on update and delete.
tourSchema.pre('save', function(next) {
  console.log('Document middleware 1...');
  this.slug = slugify(this.name, { lower: true });
  next();
});

//Query middleware
tourSchema.pre(/^find/, function(next) {
  //this.find({ secretTour: { $ne: true } });
  this.find();
  this.start = Date.now();
  next();
});

tourSchema.pre(/^find/, function(next) {
  next();
});

tourSchema.post(/^find/, function(doc, next) {
  next();
});

//Aggregation middleware
tourSchema.pre('aggregate', function(next) {
  //this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  console.log('Aggregation middleware 1...');
  console.log(this.pipeline());
  next();
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
