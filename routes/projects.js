const express = require('express');
const router = express.Router();
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });
const { asyncErrorHandler, isLoggedIn, isAdmin, searchAndFilterProjects  } = require('../middleware/index');
const { projectIndex, 
        projectNew, 
        projectCreate,
        projectShow,
        projectEdit,
        projectUpdate,
        projectDestroy,
        addProjectToFavourite
      } = require('../controllers/projects');


/* Get projects index /projects */

router.get('/',asyncErrorHandler(searchAndFilterProjects), asyncErrorHandler(projectIndex));

/* Get projects new /projects */  
router.get('/new', isLoggedIn, projectNew);


/* Get projects CREATE /projects/:id */  
router.post('/',isLoggedIn, upload.array('images', 16), asyncErrorHandler(projectCreate));

/* Get projects show /projects/:id */  
router.get('/:id', asyncErrorHandler(projectShow));

/* Get projects edit /projects/:id/edit */  
router.get('/:id/edit',isLoggedIn, asyncErrorHandler(isAdmin), projectEdit);

/* PUT projects update /projects/:id */  
router.put('/:id',isLoggedIn, upload.array('images', 16),asyncErrorHandler(isAdmin), asyncErrorHandler(projectUpdate));

/* DELETE projects destroy /projects/:id */  
router.delete('/:id',isLoggedIn, asyncErrorHandler(isAdmin),  asyncErrorHandler(projectDestroy));

router.post('/:id/addTofavourite',isLoggedIn, asyncErrorHandler(addProjectToFavourite));



module.exports = router;