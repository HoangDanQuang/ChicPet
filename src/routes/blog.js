const express = require('express');
const BlogController = require('../app/controllers/BlogController');
const router = express.Router();

router.get('/postBlog', BlogController.postBlog_get);
router.post('/postBlog', BlogController.postBlog_post);
router.get('/', BlogController.blog_get);


module.exports = router;