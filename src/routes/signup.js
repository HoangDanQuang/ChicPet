const express = require('express');
const router = express.Router();

const signupController = require('../app/controllers/SignUpController.js');

router.use('/', signupController.index);

module.exports = router;