const express = require('express');
const router = express.Router();
const { asyncErrorHandler } = require('../middleware/index');
const multer = require('multer');
const upload = multer({'dest':'uploads/'})
const { projectIndex, 
        projectNew, 
        projectCreate,
        projectShow,
        projectEdit,
        projectUpdate,
        projectDestroy 
      } = require('../controllers/projects');


/* Get projects index /projects */

router.get('/', asyncErrorHandler(projectIndex) );

/* Get projects new /projects */  
router.get('/new', projectNew);


/* Get projects CREATE /projects/:id */  
router.post('/',upload.array('images', 16), asyncErrorHandler(projectCreate));

/* Get projects show /projects/:id */  
router.get('/:id', asyncErrorHandler(projectShow));

/* Get projects edit /projects/:id/edit */  
router.get('/:id/edit', asyncErrorHandler(projectEdit));

/* PUT projects update /projects/:id */  
router.put('/:id', asyncErrorHandler(projectUpdate));

/* DELETE projects destroy /projects/:id */  
router.delete('/:id',  asyncErrorHandler(projectDestroy));

module.exports = router;