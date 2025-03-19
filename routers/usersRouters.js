const express = require('express');
const routers = express.Router();
const {
  protect,
  signup,
  login,
  logout,
  forgotPassword,
  resetPassword,
  updatePassword
} = require('./../controller/authController');
const {
  getAllUser,
  getUser,
  getMe,
  updateUser,
  deleteUser,
  updateMe,
  uploadUserPhoto,
  resizeUserPhoto,
  deleteMe
} = require('./../controller/userController');
const { router } = require('../app');

routers.route('/signup').post(signup);
routers.route('/login').post(login);
routers.route('/logout').get(logout);
routers.route('/forgotPassword').post(protect, forgotPassword);
routers.route('/resetPassword/:token').patch(protect, resetPassword);

//Protect all routes after this
//routers.use(protect);

routers.route('/updatePassword').patch(protect, updatePassword);

routers
  .route('/updateMe')
  .patch(protect, uploadUserPhoto, resizeUserPhoto, updateMe);
routers.route('/deleteMe').delete(protect, deleteMe);

routers.route('/').get(getAllUser);

// routers.route('/create').post(createUser);

routers.get('/me', getMe, getUser);

routers
  .route('/:id?')
  .get(getUser)
  .patch(updateUser)
  .delete(deleteUser);

module.exports = routers;
