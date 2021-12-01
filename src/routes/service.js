const express = require('express');
const ServiceController = require('../app/controllers/ServiceController');
const { requireAuth } = require('../app/middleware/AuthMiddleware');
const router = express.Router();

router.get('/book', requireAuth, ServiceController.book_get);
router.post('/book', requireAuth, ServiceController.book_post);
router.get('/', ServiceController.service_get);


router.get('/postService', ServiceController.postService_get);
router.post('/postService/uploadSingle', /* upload.single('image-Service'), */ ServiceController.postService_post);
router.get('/:code', ServiceController.detailService_get);
module.exports = router;