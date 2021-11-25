const res = require("express/lib/response");
const Blog = require('../models/Blog');
/* const multer = require('multer');
const path = require('path')
 */
module.exports.blog_get = (req, res) => {
    res.render('blog');
}

module.exports.postBlog_get = (req, res) => {
    res.render('postBlog');
}

/* const storage = multer.diskStorage({
    destination: (req, file, cb) =>{
        cb(null, './../public/img/blog')
    }, 
    filename: (req, file, cb) =>{
        console.log(file);
        cb(null, Date.now() + path.extname(file.originalname))
    }
})
const upload = multer({storage: storage}) */

module.exports.postBlog_post = async (req, res) => {
    const { title, img, category, description, contentCode} = req.body;
   // upload.single(img);
    try {
        var newBlog = new Blog({
            blogCode: '#000000',
            title: title,
            img: 'image',
            category: category,
            description: description,
            postingTime: Date.now(),
            contentCode: contentCode
        });
        newBlog.save().then(result => {
            console.log('posting successful');
            console.log(newBlog);
            res.status(200).json({ blog: newBlog });
        });
    }
    catch(err) {
        console.log('book_post error');
        console.log(err);
        var error = JSON.stringify({ error: err });
        res.status(400).json({ error});
    }
}