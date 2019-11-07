const express = require('express');
const router = express.Router({ mergeParams: true });

/* Get reviews index /projects/:review_id/reviews */

router.get('/', (req, res, next) => {
    res.send('/reviews')
  });


/* Get reviews CREATE /projects/:review_id/reviews */  
router.post('/', (req, res, next) => {
  res.send('CREATE /reviews')
});


/* Get reviews edit /projects/:id/reviews/:review_id/edit */  
router.get('/:review_id/edit', (req, res, next) => {
  res.send('EDIT /projects/:id/reviews/:review_id/edit')
});

/* PUT reviews update /projects/:id/reviews/:review_id/ */  
router.put('/:review_id', (req, res, next) => {
  res.send('UPDATE /projects/:id/reviews/:review_id')
});

/* DELETE reviews destroy /projects/:id/reviews/:review_id/ */  
router.delete('/:review_id', (req, res, next) => {
  res.send('DELETE /projects/:id/reviews/:review_id')
});

module.exports = router;