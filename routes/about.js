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
    aboutGoalsEdit,
    aboutGoalsUpdate,
    aboutHistoryNew,
    aboutHistoryCreate,
    aboutHistoryEdit,
    aboutHistoryUpdate
} = require('../controllers/about')


/* About Goals routes */

router.get('/',asyncErrorHandler(aboutIndex));


router.get('/new-goals', isLoggedIn,asyncErrorHandler(isAdmin), aboutGoalsNew);

router.post('/new-goals',isLoggedIn,upload.array('iconImage', 1),asyncErrorHandler(isAdmin),  asyncErrorHandler(aboutGoalsCreate));


router.get('/edit-goals',isLoggedIn, asyncErrorHandler(isAdmin), aboutGoalsEdit);

router.put('/',isLoggedIn,upload.array('iconImage', 1),asyncErrorHandler(isAdmin), asyncErrorHandler(aboutGoalsUpdate));


/* About History routes */

router.get('/history', asyncErrorHandler(aboutHistory));

router.get('/new-history', isLoggedIn,asyncErrorHandler(isAdmin), aboutHistoryNew);

router.post('/new-history',isLoggedIn,upload.array('timesTempImage', 1),asyncErrorHandler(isAdmin),  asyncErrorHandler(aboutHistoryCreate));

router.get('/edit-history',isLoggedIn, asyncErrorHandler(isAdmin), aboutHistoryEdit);

router.put('/history',isLoggedIn,upload.array('timesTempImage', 1),asyncErrorHandler(isAdmin), asyncErrorHandler(aboutHistoryUpdate));

/* About Team routes */

router.get('/team', asyncErrorHandler(aboutTeam));




/* About Press routes */

router.get('/press', asyncErrorHandler(aboutPress));


module.exports = router;