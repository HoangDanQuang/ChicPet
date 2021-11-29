const res = require("express/lib/response");
const User = require('../models/User');
const Order = require('../models/Order');
const { json } = require("express/lib/response");
const mongoose = require ('mongoose');


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
            try {
                const orderList = await Order.find({}).sort({ createdAt: -1 }).lean();
                if (orderList) {
                    console.log(orderList);
                    res.render('adminOrder', { orders: orderList });
                }
                else {
                    console.log('account orderList Null');
                }
            }
            catch(err) {
                console.log('account get order error');
                console.log(err);
            }
        }
        else {
            try {
                const orderList = await Order.find({ customerId: res.locals.user._id }).sort({ createdAt: -1 }).lean();
                if (orderList) {
                    console.log(orderList);
                    res.render('accountOrder', { orders: orderList });
                }
                else {
                    console.log('account orderList null');
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

module.exports.adminOrderList_post = async (req, res) => {
    try {
        const { orderCodeSearch, orderCustomerSearch, orderFromDaySearch, orderToDaySearch } = req.body;
        console.log(orderCodeSearch);
        console.log(orderCustomerSearch);
        console.log(orderFromDaySearch);
        console.log(orderToDaySearch);
        var orderList = [];
        if (orderCodeSearch === '' && orderCustomerSearch === '' && orderFromDaySearch === '' && orderToDaySearch === '') {
            console.log('get all orders');
            // console.log('get all orders in last 30 days');
            // var currentDate = Date.now();
            // currentDate = new Date(currentDate);
            // console.log(currentDate);
            // var fromDate = currentDate;
            // fromDate.setDate(fromDate.getDate() - 29);
            // fromDate.setHours(0, 0, 0);
            // fromDate = new Date(fromDate);
            // console.log(fromDate);
            orderList = await Order.find({ }).sort({ createdAt: -1 });
        }
        else if (orderCodeSearch !== '') {
            console.log('search by order code');
            orderList = await Order.find({ orderCode: orderCodeSearch }).sort({ createdAt: -1 });
        }
        else if (orderCustomerSearch !== '') {
            if (orderFromDaySearch !== '' && orderToDaySearch !== '') {
                console.log('search by customer name and from date, to date');
                var fromDate = new Date(orderFromDaySearch);
                fromDate = fromDate.setHours(fromDate.getHours() - 7);
                fromDate = new Date(fromDate);
                var toDate = new Date(orderToDaySearch);
                toDate = toDate.setHours(toDate.getHours() - 7 + 24);
                toDate = new Date(toDate);
                orderList = await Order.find({ fullname: orderCustomerSearch, createdAt: { $gte: fromDate, $lte: toDate } }).sort({ createdAt: -1 });
            }
            else if (orderFromDaySearch !== '') {
                console.log('search by customer name and from date');
                var fromDate = new Date(orderFromDaySearch);
                fromDate = fromDate.setHours(fromDate.getHours() - 7);
                fromDate = new Date(fromDate);
                orderList = await Order.find({ fullname: orderCustomerSearch, createdAt: { $gte: fromDate } }).sort({ createdAt: -1 });
            }
            else if (orderToDaySearch !== '') {
                console.log('search by customer name and to date');
                var toDate = new Date(orderToDaySearch);
                toDate = toDate.setHours(toDate.getHours() - 7 + 24);
                toDate = new Date(toDate);
                orderList = await Order.find({ fullname: orderCustomerSearch, createdAt: { $lte: toDate } }).sort({ createdAt: -1 });
            }
            else {
                console.log('search by customer name');
                orderList = await Order.find({ fullname: orderCustomerSearch }).sort({ createdAt: -1 });
            }

            
        }
        else if (orderFromDaySearch !== '' && orderToDaySearch !== '') {
            console.log('search by from date and to date');
            var fromDate = new Date(orderFromDaySearch);
            fromDate = fromDate.setHours(fromDate.getHours() - 7);
            fromDate = new Date(fromDate);
            var toDate = new Date(orderToDaySearch);
            toDate = toDate.setHours(toDate.getHours() - 7 + 24);
            toDate = new Date(toDate);
            console.log(fromDate);
            console.log(toDate);
            orderList = await Order.find({ createdAt: { $gte: fromDate, $lte: toDate } }).sort({ createdAt: -1 });
        }
        else if (orderFromDaySearch !== '') {
            console.log('search by from date');
            var fromDate = new Date(orderFromDaySearch);
            fromDate = fromDate.setHours(fromDate.getHours() - 7);
            fromDate = new Date(fromDate);
            orderList = await Order.find({ createdAt: { $gte: fromDate } }).sort({ createdAt: -1 });
        }
        else if (orderToDaySearch !== '') {
            console.log('search by to date');
            var toDate = new Date(orderToDaySearch);
            toDate = toDate.setHours(toDate.getHours() - 7 + 24);
            toDate = new Date(toDate);
            orderList = await Order.find({ createdAt: { $lte: toDate } }).sort({ createdAt: -1 });
        }


        
        if (orderList) {
            console.log(orderList);
            res.json({ orderList: orderList });
        }
        else {
            console.log('admin orderList null');
        }
    }
    catch(err) {
        console.log('admin post orderList error');
        console.log(err);
    }
}

module.exports.orderDetail_get = async (req, res) => {
    console.log('order code: ', req.params.code);
    try {
        const order = await Order.findOne({ orderCode: req.params.code }).lean();
        if (order) {
            console.log(order);
            if (order.customerId.equals(req.session.user._id)) {
                res.render('accountOrderDetail', { order: order });
            }
            else {
                res.render('404NotFound');
            }
        }
        else {
            console.log('account order detail null');
        }
    }
    catch(err) {
        console.log('account order detail error');
        console.log(err);
    }
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