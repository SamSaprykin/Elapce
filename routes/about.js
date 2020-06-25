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
    aboutGoalsCreate
} = require('../controllers/about')


/* Get articles index /articles */

router.get('/',asyncErrorHandler(aboutIndex));

/* Get guides new /guide */  
router.get('/new-goals', isLoggedIn,asyncErrorHandler(isAdmin), aboutGoalsNew);

router.post('/new-goals',isLoggedIn,upload.array('iconImage', 1),asyncErrorHandler(isAdmin),  asyncErrorHandler(aboutGoalsCreate));

router.get('/history', asyncErrorHandler(aboutHistory));

router.get('/team', asyncErrorHandler(aboutTeam));

router.get('/press', asyncErrorHandler(aboutPress));


module.exports = router;