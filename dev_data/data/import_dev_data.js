//node dev_data/data/import_dev_data.js --import

const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const Tour = require('./../../models/tourModel');
const Review = require('./../../models/reviewModel');
const User = require('./../../models/userModel');

const DB = process.env.DATABASE;

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log('DB connection successful!');
  });

mongoose.connection.on('error', err => {
  console.log(err);
});

//Read JSON file
const tours = fs.readFileSync(`${__dirname}/tours.json`, 'utf-8');
const toursObj = JSON.parse(tours);

const users = fs.readFileSync(`${__dirname}/users.json`, 'utf-8');
const usersObj = JSON.parse(users);

const reviews = fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8');
const reviewsObj = JSON.parse(reviews);

//Import data into DB
const importData = async () => {
  try {
    await Tour.create(toursObj);
    await User.create(usersObj, { validateBeforeSave: false });
    await Review.create(reviewsObj);

    console.log('Data successfully loaded!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};
//Delete all data from DB
const deleteData = async () => {
  try {
    await Tour.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();
    console.log('Data successfully deleted!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};
if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}

if (!process.argv[2]) {
  console.log('Please provide an argument --import or --delete');
}

console.log(process.argv);
