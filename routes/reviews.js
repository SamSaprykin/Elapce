const express = require('express');
const router = express.Router({ mergeParams: true });
const { asyncErrorHandler,isReviewAuthor, isLoggedIn } = require('../middleware');
const {
  reviewCreate,
  reviewUpdate,
  reviewDestroy
} = require('../controllers/reviews')

/* Get reviews CREATE /projects/:review_id/reviews */  
router.post('/',isLoggedIn, asyncErrorHandler(reviewCreate));



/* PUT reviews update /projects/:id/reviews/:review_id/ */  
router.put('/:review_id',isReviewAuthor, asyncErrorHandler(reviewUpdate));

/* DELETE reviews destroy /projects/:id/reviews/:review_id/ */  
router.delete('/:review_id',isReviewAuthor , asyncErrorHandler(reviewDestroy));

module.exports = router;