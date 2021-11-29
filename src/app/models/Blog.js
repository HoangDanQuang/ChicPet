const mongoose = require ('mongoose')
const Schema = mongoose.Schema;

const BlogSchema = new Schema ({
/*     blogCode: {
        type: String,
        required: true,
        unique: true,
    }, */
    title: {
        type: String,
        required: true,
    },
    img: {
        type: String,
        /* data: Buffer,  */
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
    contentCode: {
        type: String,
        required: true, 
    }
},{ timestamps: true });

const Blog = mongoose.model('blog', BlogSchema);
module.exports = Blog;