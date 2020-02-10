const express = require('express');
const router = express.Router();
const { postRegister, 
        postLogin, 
        getLogout, 
        landingPage, 
        getRegister, 
        getContacts,
        getProfile,
        updateProfile,
        getForgotPw,
        putForgotPw,
        getReset,
        putReset,
        postContactUs
      } = require('../controllers');

const { asyncErrorHandler,isLoggedIn, isValidPassword, changePassword } = require('../middleware');

const multer =  require('multer');
const { storage } =  require('../cloudinary');
const upload = multer({storage});


/* GET home page. */
router.get('/', asyncErrorHandler(landingPage));

/* GET register page. */
router.get('/register', getRegister);

/* POST register page. */
/* POST /register */
  router.post('/register',
  upload.single('image'),
	asyncErrorHandler(postRegister)
);




/* POST login */
router.post('/login', asyncErrorHandler(postLogin));

/* GET logout  */
router.get('/logout', getLogout)


/* GET profile  */
router.get('/profile', isLoggedIn, asyncErrorHandler(getProfile));

/* PUT /profile */
router.put('/profile',
  isLoggedIn,
  upload.single('image'),
	asyncErrorHandler(isValidPassword),
	asyncErrorHandler(changePassword),
	asyncErrorHandler(updateProfile)
);

/* GET /forgot */
router.get('/forgot-password', getForgotPw);

/* PUT /forgot */
router.put('/forgot-password', asyncErrorHandler(putForgotPw));

/* GET /reset/:token */
router.get('/reset/:token', asyncErrorHandler(getReset));

/* PUT /reset/:token */
router.put('/reset/:token', asyncErrorHandler(putReset));

router.get('/contacts', getContacts);

router.post('/contactUs',asyncErrorHandler(postContactUs));

module.exports = router;
