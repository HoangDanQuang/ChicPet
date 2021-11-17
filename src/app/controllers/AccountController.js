const res = require("express/lib/response");
const User = require('../models/User');
const Order = require('../models/Order');
const { json } = require("express/lib/response");


module.exports.profile_get = (req, res) => {
    if (res.locals.user) {
        if (res.locals.user.role === 'admin') {
            res.render('adminProfile');
        }
        else {
            res.render('accountProfile');
        }
    }
    else res.render('accountProfile');
}

module.exports.customer_get = (req, res) => {
    if (res.locals.user) {
        if (res.locals.user.role === 'admin') {
            res.render('adminCustomer');
        }
        else {
            res.render('404NotFound');
        }
    }
    else res.render('404NotFound');
}

module.exports.order_get = async (req, res) => {
    if (res.locals.user) {
        if (res.locals.user.role === 'admin') {
            res.render('adminOrder');
        }
        else {
            try {
                const orderList = await Order.find({ customerId: res.locals.user._id }).lean();
                if (orderList) {
                    console.log(orderList);
                    res.render('accountOrder', { orders: orderList, name: 'Anthony' });
                }
                else {
                    console.log('account orderList null');
                    console.log(err);
                }
            }
            catch(err) {
                console.log('account get order error');
                console.log(err);
            }
        }
    }
    else res.render('accountOrder');
}

module.exports.orderDetail_get = (req, res) => {
    res.render('accountOrderDetail');
}

module.exports.voucher_get = (req, res) => {
    if (res.locals.user) {
        if (res.locals.user.role === 'admin') {
            res.render('adminVoucher');
        }
        else {
            res.render('404NotFound');
        }
    }
    else res.render('404NotFound');
}





module.exports.makeOrder_get = (req, res) => {
    try {
        var newOrder = new Order({
            orderCode: '#123456789',
            customerId: res.locals.user._id,
            fullname: res.locals.user.fullname,
            phone: res.locals.user.phone,
            mail: res.locals.user.mail,
            meetingTime: Date.now(),
            status: 'Đã hoàn thành',
            services: [
                {
                    serviceName: 'Cắt tỉa lông chó',
                    type: 'M',
                    quantity: 2,
                    price: 150000,
                    total: 300000,
                },
                {
                    serviceName: 'Spa cho chó',
                    type: 'M',
                    quantity: 2,
                    price: 150000,
                    total: 300000,
                },
            ],
            discount: -50000,
            voucher: -50000,
            total: 500000,
            note: '',
        });
        newOrder.save().then(result => {
            console.log('make order successful');
            console.log(newOrder);
            res.status(400).json({ order: newOrder });
        });
    }
    catch (err) {
        console.log('make order post error');
        console.log(err);
        res(err);
    }
}