const express = require('express');
const router = express.Router();
const {postRegister} = require('../controllers/index');


/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', { title: 'Elapce' });
});

/* GET register page. */
router.get('/register', (req, res, next) => {
  res.send('GET /register');
});

/* POST register page. */
router.post('/register', postRegister);


/* GET login */
router.get('/login', (req, res, next) => {
  res.send('GET /login');
});

/* POST login */
router.post('/login', (req, res, next) => {
  res.send('POST /login');
});


/* GET profile  */
router.get('/profile', (req, res, next) => {
  res.send('GET /profile');
});

/* PUT profil/:user_id. */
router.put('/profile/:user_id', (req, res, next) => {
  res.send('PUT /profile');
});

/* GET forgot  */
router.get('/forgot', (req, res, next) => {
  res.send('GET /forgot-password');
});

/* PUT forgot  */
router.put('/forgot', (req, res, next) => {
  res.send('PUT /forgot-password');
});

/* GET reset/:token  */
router.get('/reset/:token', (req, res, next) => {
  res.send('GET /reset-password/:token');
});


/* PUT reset/:token  */
router.put('/reset/:token', (req, res, next) => {
  res.send('put /reset-password/:token');
});

module.exports = router;
