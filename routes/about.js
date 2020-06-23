const express = require('express');
const router = express.Router();
const multer = require('multer');
const { storage } = require('../cloudinary');
const { asyncErrorHandler, isLoggedIn, searchAndFilterArticles, isTeamMember  } = require('../middleware/index');

const {
    aboutIndex,
    aboutHistory,
    aboutTeam,
    aboutPress,
} = require('../controllers/about')


/* Get articles index /articles */

router.get('/',asyncErrorHandler(aboutIndex));

router.get('/history', asyncErrorHandler(aboutHistory));

router.get('/team', asyncErrorHandler(aboutTeam));

router.get('/press', asyncErrorHandler(aboutPress));


module.exports = router;