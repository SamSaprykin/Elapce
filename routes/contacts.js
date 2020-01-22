const express = require('express');
const router = express.Router();
const { getContacts } = require('../controllers/contacts');


/* GET register page. */
router.get('/contacts', getContacts);


module.exports = router;