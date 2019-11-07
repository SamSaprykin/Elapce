const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', { title: 'Elapce' });
});

/* GET register page. */
router.get('/register', (req, res, next) => {
  res.send('GET /register');
});

/* POST register page. */
router.post('/register', (req, res, next) => {
  res.send('POST /register');
});


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

/* GET reset  */
router.get('/reset/:token', (req, res, next) => {
  res.send('GET /reset-password/:token');
});


/* PUT reset  */
router.put('/reset/:token', (req, res, next) => {
  res.send('put /reset-password/:token');
});

module.exports = router;
