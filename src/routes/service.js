const express = require('express');
const ServiceController = require('../app/controllers/ServiceController');
const router = express.Router();

router.get('/book', ServiceController.book_get);
router.post('/book', ServiceController.book_post);
router.get('/', ServiceController.service_get);


module.exports = router;