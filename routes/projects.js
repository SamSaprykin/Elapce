const express = require('express');
const router = express.Router();

/* Get projects index /projects */

router.get('/', (req, res, next) => {
    res.send('/projects')
  });

/* Get projects new /projects */  
router.get('/new', (req, res, next) => {
  res.send('/projects/new')
});


/* Get projects CREATE /projects/:id */  
router.post('/', (req, res, next) => {
  res.send('CREATE /projects')
});

/* Get projects show /projects/:id */  
router.get('/:id', (req, res, next) => {
  res.send('SHOW /projects/:id')
});

/* Get projects edit /projects/:id/edit */  
router.get('/:id/edit', (req, res, next) => {
  res.send('EDIT /projects/:id/edit')
});

/* PUT projects update /projects/:id */  
router.put('/:id', (req, res, next) => {
  res.send('UPDATE /projects/:id')
});

/* DELETE projects destroy /projects/:id */  
router.delete('/:id', (req, res, next) => {
  res.send('DELETE /projects/:id')
});

module.exports = router;