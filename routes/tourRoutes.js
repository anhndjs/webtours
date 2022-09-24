const express = require('express');
const tourController = require('./../controllers/tourController');
const authController = require('./../controllers/authController');
const reviewRouter = require('./../routes/reviewRouter')
const router = express.Router();
// router.param('id',tourController.checkId)
router.route('/top-5-cheap').get(tourController.aliasTopTours,tourController.getAllTours)
router.route('/tour-stats').get(tourController.getTourStats)
router.route('/monthly-plan/:year').get(authController.protect,authController.restricTo('admin','lead-guide','guide'),tourController.getMonthlyPlan)
router.route('/tours-within/:distance/center/:latlng/unit/:unit').get(tourController.getToursWithin)

// router
// .route('/:tourId/reviews')
// .post(authController.protect,
// authController.restricTo('user'),
// reviewController.createReview
//    )
router.route('/distances/:latlng/unit/:unit').get(tourController.getDistances)
router.use('/:tourId/reviews',reviewRouter)
router
.route('/')
.get(authController.protect,tourController.getAllTours)
.post(authController.protect,authController.restricTo('admin','lead-guide'),
 tourController.createTour)
router
.route('/:id')
.get(tourController.getTours)
.patch(
authController.protect,
authController.restricTo('admin','lead-guide'),
tourController.updateTour)
.delete(
authController.protect,
authController.restricTo('admin','lead-guide'),
 tourController.deleteTour);
module.exports = router;