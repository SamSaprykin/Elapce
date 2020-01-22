const express = require('express');
const router = express.Router();
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });
const { asyncErrorHandler, isLoggedIn, isAdmin, searchAndFilterArticles  } = require('../middleware/index');
const { articlesIndex, 
        articleNew, 
        articleCreate,
        articleEdit,
        articleUpdate,
        articleDestroy,
        articleShow
      } = require('../controllers/articles');


/* Get articles index /articles */

router.get('/', asyncErrorHandler(searchAndFilterArticles), asyncErrorHandler(articlesIndex));

/* Get articles new /articles */  
router.get('/new', isLoggedIn,asyncErrorHandler(isAdmin), articleNew);


/* Get article CREATE /articles/:id */  
router.post('/',isLoggedIn,upload.array('images', 2),asyncErrorHandler(isAdmin),  asyncErrorHandler(articleCreate));

/* Get articles show /articles/:id */  
router.get('/:id', asyncErrorHandler(articleShow));

/* Get articles edit /articles/:id/edit */  
router.get('/:id/edit',isLoggedIn, asyncErrorHandler(isAdmin), articleEdit);

/* PUT articles update /articles/:id */  
router.put('/:id',isLoggedIn,upload.array('images', 16),asyncErrorHandler(isAdmin), asyncErrorHandler(articleUpdate));

/* DELETE articles destroy /articles/:id */  
router.delete('/:id',isLoggedIn, asyncErrorHandler(isAdmin),  asyncErrorHandler(articleDestroy));


module.exports = router;