const express = require('express');
const router = express.Router();

/* Get projects index /posts */

router.get('/', (req, res, next) => {
    res.send('/projects')
  });

/* Get projects new /posts */  
router.get('/new', (req, res, next) => {
  res.send('/projects/new')
});


/* Get projects CREATE /posts/:id */  
router.post('/', (req, res, next) => {
  res.send('CREATE /projects')
});

/* Get projects show /posts/:id */  
router.get('/:id', (req, res, next) => {
  res.send('SHOW /projects/:id')
});

/* Get projects edit /posts/:id/edit */  
router.get('/:id/edit', (req, res, next) => {
  res.send('EDIT /projects/:id/edit')
});

/* PUT projects update /posts/:id */  
router.put('/:id', (req, res, next) => {
  res.send('UPDATE /projects/:id')
});

/* DELETE projects destroy /posts/:id */  
router.delete('/:id', (req, res, next) => {
  res.send('DELETE /projects/:id')
});

module.exports = router;