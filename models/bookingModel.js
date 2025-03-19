const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Booking must belong to a tour']
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Booking must belong to a user']
    },
    price: {
      type: Number,
      required: [true, 'Booking must have a price']
    },
    createdAt: {
      type: Date,
      default: Date.now()
    },
    paid: {
      type: Boolean,
      default: true
    }
  }
  //   {
  //     toJSON: { virtuals: true },
  //     toObject: { virtuals: true }
  //   }
);

bookingSchema.pre(/^find/, function(next) {
  this.populate({ path: 'user', select: 'name email photo' })
  .populate({
    path: 'tour',
    select: 'name'
  })
  .populate({
    path: 'reviews',
    select: 'review rating'
  });
  next();
});

bookingSchema.virtual('duration').get(function() {
  return this.endAt - this.startAt;
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
