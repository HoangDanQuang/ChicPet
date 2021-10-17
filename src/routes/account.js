const express = require('express');
const router = express.Router();

const accountController = require('../controllers/AccountController');

router.use('/account', accountController.index);


module.exports = router;