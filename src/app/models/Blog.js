const mongoose = require ('mongoose')
const Schema = mongoose.Schema;

const BlogSchema = new Schema ({
    blogCode: {
        type: String,
        required: true,
        unique: true,
    },
    title: {
        type: String,
        required: true,
    },
    img: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    postingTime: {
        type: Date,
    },
    contentCode: {
        type: String,
        required: true,
    }
});

const Blog = mongoose.model('blog', BlogSchema);
module.exports = Blog;