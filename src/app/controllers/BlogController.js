const res = require("express/lib/response");
const Blog = require('../models/Blog');
const mongoose = require ('mongoose');

/* const path = require('path') */
/* var fs = require('fs'); */


module.exports.blog_get = async (req, res) => {
    try {
        const blogList = await Blog.find({}).sort({ createdAt: -1 }).limit(15).lean();
        if (blogList) {
            console.log(blogList);
            res.render('blog', { blogs: blogList });
        }
        else {
            console.log('blogList Null');
        }
    }
    catch(err) {
        console.log('get blog error');
        console.log(err);
    }
}

module.exports.postBlog_get = (req, res) => {
    res.render('postBlog');
}


//---------------------------------------------------------------------------

module.exports.postBlog_post = async (req, res) => {
    console.log('req.body: ' + req.body);

/*     if (req.files == undefined) {
        return res.send({
          message: "You must select a file.",
        });
    }
    else{
        console.log(req.file)
    } */
  
    const { title, img, category, description, contentCode} = req.body;
/*     var image = fs.readFileSync(req.file.path);
    var encode_image = image.toString('base64'); */
    try {
        var newBlog = new Blog({
           /*  blogCode: Date.now(), */
            title: title,
            img: img,
            category: category,
            description: description,
           /*  postingTime: Date.now(), */
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
};