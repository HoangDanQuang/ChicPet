const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const ServiceSchema = new Schema({
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
    // prices: [{
    //     type: {
    //         type: String,
    //         required: true,
    //     },
    //     price: {
    //         type: Number,
    //         required: true,
    //     },
    // }],
    priceS: {
        type: Number,
        required: true,
    },
    priceM: {
        type: Number,
        required: true,
    },
    priceL: {
        type: Number,
        required: true,
    },
    contentCode: {
        type: String,
        required: true,
    }
    // title: {
    //     type: String,
    //     required: true,
    // },
    // img: {
    //     type: String,
    //     /* data: Buffer,  */
    //     required: true,
    // },
    // category: {
    //     type: String,
    //     required: true,
    // },
    // description: {
    //     type: String,
    //     required: true,
    // },
    // contentCode: {
    //     type: String,
    //     required: true,
    // }
}, { timestamps: true });
const Service = mongoose.model('service', ServiceSchema);
module.exports = Service;