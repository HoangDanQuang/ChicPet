const res = require("express/lib/response");
const Order = require('../models/Order');
const mongoose = require ('mongoose');


module.exports.service_get = (req, res) => {
    res.render('service');
}

module.exports.book_get = (req, res) => {
    res.render('book');
}

module.exports.book_post = async (req, res) => {
    const { name, phone, email, appointment, services, note} = req.body;

    try {
        if (req.session.user) {
            console.log('service controller req.session.user');
            console.log(req.session.user);
        }
        else console.log('service controller req.session.user NULL');
        var newOrder = new Order({
            orderCode: generateOrderCode(),
            customerId: req.session.user._id,
            fullname: name,
            phone: phone,
            mail: email,
            meetingTime: appointment,
            status: 'Chờ xác nhận',
            services: services,
            sum: 0,
            discount: 0,
            voucher: '',
            total: 0,
            note: note,
            payment: 'Tiền mặt',
        });
        newOrder.save().then(result => {
            console.log('make order successful');
            console.log(result);
            res.status(200).json({ order: newOrder });
        });
    }
    catch(err) {
        console.log('book_post error');
        console.log(err);
        var error = JSON.stringify({ error: err });
        res.status(400).json({ error});
    }
}

const generateOrderCode = () => {
    var orderCode = Date.now().toString();
    orderCode = orderCode.substring(orderCode.length - 9);
    return orderCode;
}