const express = require('express');
const SignUpController = require('../app/controllers/SignUpController.js');
const router = express.Router();

const signupController = require('../app/controllers/SignUpController.js');

router.get('/', SignUpController.index);
router.post('/', signupController.signup);

module.exports = router;