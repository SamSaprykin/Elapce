const express = require('express');
const router = express.Router();
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });
const { asyncErrorHandler, isLoggedIn,searchAndFilterGuides, isTeamMember  } = require('../middleware/index');
const { gudiesIndex, 
        guideNew,
        guideCreate, 
        guideEdit,
        guideUpdate,
        guideDestroy,
        guideShow
      } = require('../controllers/guides');


/* Get guides index /guides */

router.get('/',asyncErrorHandler(searchAndFilterGuides), asyncErrorHandler(gudiesIndex));

/* Get guides new /guide */  
router.get('/new', isLoggedIn,asyncErrorHandler(isTeamMember), guideNew);


router.post('/',isLoggedIn,upload.array('images', 2),asyncErrorHandler(isTeamMember),  asyncErrorHandler(guideCreate));
/* Get guides show /guides/:id */  
router.get('/:id', asyncErrorHandler(guideShow));

/* Get guides edit /guides/:id/edit */  
router.get('/:id/edit',isLoggedIn, asyncErrorHandler(isTeamMember), guideEdit);


/* PUT guides update /guides/:id */  
router.put('/:id',isLoggedIn,upload.array('images', 16),asyncErrorHandler(isTeamMember), asyncErrorHandler(guideUpdate));

/* DELETE guides destroy /guides/:id */  
router.delete('/:id',isLoggedIn, asyncErrorHandler(isTeamMember),  asyncErrorHandler(guideDestroy));


module.exports = router;