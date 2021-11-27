const express = require('express');
const ServiceController = require('../app/controllers/ServiceController');
const { requireAuth } = require('../app/middleware/AuthMiddleware');
const router = express.Router();

router.get('/book', requireAuth, ServiceController.book_get);
router.post('/book', requireAuth, ServiceController.book_post);
router.get('/', ServiceController.service_get);


module.exports = router;