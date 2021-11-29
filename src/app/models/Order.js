const mongoose = require ('mongoose');
const Schema = mongoose.Schema;

const OrderSchema = new Schema ({
    orderCode: {
        type: String,
        required: true,
        unique: true,
    },
    customerId: {
        type: Schema.Types.ObjectId,
    },
    fullname: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    mail: {
        type: String,
    },
    meetingTime: {
        type: Date,
    },
    status: {
        type: String,
        required: true,
    },
    services: [{
        serviceName: {
            type: String,
            required: true,
        },
        type: {
            type: String,
        },
        quantity: {
            type: Number,
            required: true,
        },
        price: Number,
        total: Number,
    }],
    sum: {
        type: Number,
    },
    discount: {
        type: Number,
    },
    voucher: {
        type: String,
    },
    total: {
        type: Number,
    },
    note: {
        type: String,
    },
    payment: {
        type: String,
    },
},{ timestamps: true });

const Order = mongoose.model('order', OrderSchema);
module.exports = Order;