const express = require('express');
const router = express.Router();
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });
const { asyncErrorHandler, isLoggedIn, searchAndFilterArticles, isTeamMember, isAdmin  } = require('../middleware/index');

const {
    aboutIndex,
    aboutHistory,
    aboutTeam,
    aboutPress,
    aboutGoalsNew,
    aboutGoalsCreate,
    aboutGoaslEdit,
    aboutGoaslUpdate
} = require('../controllers/about')


/* Get about index /about */

router.get('/',asyncErrorHandler(aboutIndex));

/* Get about new /guide */  
router.get('/new-goals', isLoggedIn,asyncErrorHandler(isAdmin), aboutGoalsNew);

router.post('/new-goals',isLoggedIn,upload.array('iconImage', 1),asyncErrorHandler(isAdmin),  asyncErrorHandler(aboutGoalsCreate));

/* Get about edit  */  
router.get('/edit-goals',isLoggedIn, asyncErrorHandler(isAdmin), aboutGoaslEdit);

/* PUT guides update /about */  
router.put('/',isLoggedIn,upload.array('iconImage', 1),asyncErrorHandler(isAdmin), asyncErrorHandler(aboutGoaslUpdate));

router.get('/history', asyncErrorHandler(aboutHistory));

router.get('/team', asyncErrorHandler(aboutTeam));

router.get('/press', asyncErrorHandler(aboutPress));


module.exports = router;