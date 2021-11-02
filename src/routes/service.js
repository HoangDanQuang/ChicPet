const express = require('express');
const ServiceController = require('../app/controllers/ServiceController');
const router = express.Router();

const accountController = require('../app/controllers/ServiceController');

router.use('/', ServiceController.index);


module.exports = router;