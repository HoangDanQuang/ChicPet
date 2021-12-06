const res = require("express/lib/response");
const User = require('../models/User');
const Order = require('../models/Order');
const { json } = require("express/lib/response");
const mongoose = require ('mongoose');
const bcrypt = require('bcrypt');


module.exports.profile_get = (req, res) => {
    if (res.locals.user) {
        if (res.locals.user.role === 'admin') {
            res.render('adminProfile');
        }
        else {
            res.render('accountProfile');
        }
    }
    else res.render('404NotFound');
}

module.exports.profile_post = async (req, res) => {
    const { newName, newEmail, newPhone, newAddress, oldPassword, newPassword } = req.body;
    if (res.locals.user) {
        try {
            if (oldPassword === '' || newPassword === '') {
                console.log('update user without updating password');
                // var updateUser = await User.findById(res.locals.user._id);
                // updateUser.fullname = newName;
                // updateUser.phone = newPhone;
                // updateUser.mail = newEmail;
                // updateUser.address = newAddress;
                // updateUser.save().then(result => {
                //     res.locals.user = updateUser;
                //     req.session.user = updateUser;
                //     res.json({ info: { newName, newEmail, newPhone, newAddress } });
                // });
                await User.findOneAndUpdate(
                    { userCode: req.session.user.userCode },
                    { fullname: newName, phone: newPhone, mail: newEmail, address: newAddress },
                    { runValidators: true, context: 'query' },
                ).then(result => {
                    res.locals.user = result;
                    req.session.user = result;
                    res.json({ info: { newName, newEmail, newPhone, newAddress } });
                });
            }
            else {
                console.log('update user with updating password');
                // var updateUser = await User.findById(res.locals.user._id);
                // const auth = await bcrypt.compare(oldPassword, updateUser.password);
                const auth = await bcrypt.compare(oldPassword, req.session.user.password);
                if (auth) {
                    // updateUser.fullname = newName;
                    // updateUser.phone = newPhone;
                    // updateUser.mail = newEmail;
                    // updateUser.address = newAddress;
                    // const salt = await bcrypt.genSalt();
                    // updateUser.password = await bcrypt.hash(newPassword, salt);
                    // updateUser.save().then(result => {
                    //     res.locals.user = updateUser;
                    //     req.session.user = updateUser;
                    //     res.json({ info: { newName, newEmail, newPhone, newAddress } });
                    // });
                    const salt = await bcrypt.genSalt();
                    const encryptedPassword = await bcrypt.hash(newPassword, salt);
                    await User.findOneAndUpdate(
                        { userCode: req.session.user.userCode },
                        { fullname: newName, phone: newPhone, mail: newEmail, address: newAddress, password: encryptedPassword },
                        { runValidators: true, context: 'query' },
                    ).then(result => {
                        res.locals.user = result;
                        req.session.user = result;
                        res.json({ info: { newName, newEmail, newPhone, newAddress } });
                    });
                }
                else {
                    res.json({ error: { password: 'Incorrect Password' } });
                }
            }
        }
        catch(err) {
            console.log('account post profile error');
            console.log(err);
        }
    }
    else res.render('404NotFound');
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

module.exports.adminCustomerList_post = async (req, res) => {
    if (res.locals.user) {
        if (res.locals.user.role === 'admin') {
            try {
                const { customerCodeSearch, customerNameSearch, customerPhoneSearch, customerMailSearch } = req.body;
                console.log(customerCodeSearch);
                console.log(customerNameSearch);
                console.log(customerPhoneSearch);
                console.log(customerMailSearch);

                var customerList = [];
                if (customerCodeSearch === '' && customerNameSearch === '' && customerPhoneSearch === '' && customerMailSearch === '') {
                    console.log('get all customers');
                    customerList = await User.find({ role: 'customer' });
                }
                else if (customerCodeSearch !== '') {
                    console.log('search by customer code');
                    customerList = await User.find({ role: 'customer', userCode: customerCodeSearch });
                }
                else if (customerNameSearch !== '') {
                    console.log('search by customer name');
                    customerList = await User.find({ role: 'customer', fullname: customerNameSearch });
                }
                else if (customerPhoneSearch !== '') {
                    console.log('search by customer phone');
                    customerList = await User.find({ role: 'customer', phone: customerPhoneSearch });
                }
                else if (customerMailSearch !== '') {
                    console.log('search by customer mail');
                    customerList = await User.find({ role: 'customer', mail: customerMailSearch });
                }

                if (customerList) {
                    console.log(customerList);
                    res.json({ customerList: customerList });
                }
                else {
                    console.log('admin customerList null');
                }
            }
            catch(err) {
                console.log('admin customer list post error');
                console.log(err);
            }
        }
        else {
            console.log('customerList post not authorized');
        }
    }
    else {
        console.log('user not log in');
    }
}

module.exports.adminDeleteCustomer_post = async (req, res) => {
    if (res.locals.user) {
        if (res.locals.user.role === 'admin') {
            try {
                const { userCodeToDelete } = req.body;
                const result = await User.deleteOne({ userCode: userCodeToDelete });
                if (result) {
                    console.log('delete successful');
                    console.log(result);
                    res.json({ status: 200 });
                }
                else {
                    console.log('delete fail');
                    res.json({ error: 'delete return null' });
                }
            }
            catch(err) {
                console.log('admin customer delete post error');
                console.log(err);
                res.json({ error: 'delete customer error' });
            }
        }
        else {
            console.log('customer delete post not authorized');
        }
    }
    else {
        console.log('user not log in');
    }
}

module.exports.order_get = async (req, res) => {
    if (res.locals.user) {
        if (res.locals.user.role === 'admin') {
            res.render('adminOrder');
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
    if (res.locals.user) {
        if (res.locals.user.role === 'admin') {
            try {
                const { orderCodeSearch, orderCustomerCodeSearch, orderCustomerNameSearch, orderStatusSearch, orderFromDaySearch, orderToDaySearch } = req.body;
                console.log(orderCodeSearch);
                console.log(orderCustomerCodeSearch);
                console.log(orderCustomerNameSearch);
                console.log(orderStatusSearch);
                console.log(orderFromDaySearch);
                console.log(orderToDaySearch);
                var orderList = [];
                if (orderCodeSearch === '' && orderCustomerCodeSearch === '' && orderCustomerNameSearch === '' && orderStatusSearch === 'Tất cả' && orderFromDaySearch === '' && orderToDaySearch === '') {
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
                else if (orderCustomerCodeSearch !== '') {
                    if (orderStatusSearch !== 'Tất cả') {
                        if (orderFromDaySearch !== '' && orderToDaySearch !== '') {
                            console.log('search by customer code, order status, from date and to date');
                            var fromDate = new Date(orderFromDaySearch);
                            fromDate = fromDate.setHours(fromDate.getHours() - 7);
                            fromDate = new Date(fromDate);
                            var toDate = new Date(orderToDaySearch);
                            toDate = toDate.setHours(toDate.getHours() - 7 + 24);
                            toDate = new Date(toDate);
                            orderList = await Order.find({ userCode: orderCustomerCodeSearch, status: orderStatusSearch, createdAt: { $gte: fromDate, $lte: toDate } }).sort({ createdAt: -1 });
                        }
                        else if (orderFromDaySearch !== '') {
                            console.log('search by customer code, order status, from date');
                            var fromDate = new Date(orderFromDaySearch);
                            fromDate = fromDate.setHours(fromDate.getHours() - 7);
                            fromDate = new Date(fromDate);
                            orderList = await Order.find({ userCode: orderCustomerCodeSearch, status: orderStatusSearch, createdAt: { $gte: fromDate } }).sort({ createdAt: -1 });
                        }
                        else if (orderToDaySearch !== '') {
                            console.log('search by customer code, order status, to date');
                            var toDate = new Date(orderToDaySearch);
                            toDate = toDate.setHours(toDate.getHours() - 7 + 24);
                            toDate = new Date(toDate);
                            orderList = await Order.find({ userCode: orderCustomerCodeSearch, status: orderStatusSearch, createdAt: { $lte: toDate } }).sort({ createdAt: -1 });
                        }
                        else {
                            console.log('search by customer code, order status');
                            orderList = await Order.find({ userCode: orderCustomerCodeSearch, status: orderStatusSearch }).sort({ createdAt: -1 });
                        }
                    }
                    else {
                        if (orderFromDaySearch !== '' && orderToDaySearch !== '') {
                            console.log('search by customer code, from date and to date');
                            var fromDate = new Date(orderFromDaySearch);
                            fromDate = fromDate.setHours(fromDate.getHours() - 7);
                            fromDate = new Date(fromDate);
                            var toDate = new Date(orderToDaySearch);
                            toDate = toDate.setHours(toDate.getHours() - 7 + 24);
                            toDate = new Date(toDate);
                            orderList = await Order.find({ userCode: orderCustomerCodeSearch, createdAt: { $gte: fromDate, $lte: toDate } }).sort({ createdAt: -1 });
                        }
                        else if (orderFromDaySearch !== '') {
                            console.log('search by customer code, from date');
                            var fromDate = new Date(orderFromDaySearch);
                            fromDate = fromDate.setHours(fromDate.getHours() - 7);
                            fromDate = new Date(fromDate);
                            orderList = await Order.find({ userCode: orderCustomerCodeSearch, createdAt: { $gte: fromDate } }).sort({ createdAt: -1 });
                        }
                        else if (orderToDaySearch !== '') {
                            console.log('search by customer code, to date');
                            var toDate = new Date(orderToDaySearch);
                            toDate = toDate.setHours(toDate.getHours() - 7 + 24);
                            toDate = new Date(toDate);
                            orderList = await Order.find({ userCode: orderCustomerCodeSearch, createdAt: { $lte: toDate } }).sort({ createdAt: -1 });
                        }
                        else {
                            console.log('search by customer code');
                            orderList = await Order.find({ userCode: orderCustomerCodeSearch }).sort({ createdAt: -1 });
                        }
                    }
                }
                else if (orderCustomerNameSearch !== '') {
                    if (orderStatusSearch !== 'Tất cả') {
                        if (orderFromDaySearch !== '' && orderToDaySearch !== '') {
                            console.log('search by customer name, order status, from date and to date');
                            var fromDate = new Date(orderFromDaySearch);
                            fromDate = fromDate.setHours(fromDate.getHours() - 7);
                            fromDate = new Date(fromDate);
                            var toDate = new Date(orderToDaySearch);
                            toDate = toDate.setHours(toDate.getHours() - 7 + 24);
                            toDate = new Date(toDate);
                            orderList = await Order.find({ fullname: orderCustomerNameSearch, status: orderStatusSearch, createdAt: { $gte: fromDate, $lte: toDate } }).sort({ createdAt: -1 });
                        }
                        else if (orderFromDaySearch !== '') {
                            console.log('search by customer name, order status, from date');
                            var fromDate = new Date(orderFromDaySearch);
                            fromDate = fromDate.setHours(fromDate.getHours() - 7);
                            fromDate = new Date(fromDate);
                            orderList = await Order.find({ fullname: orderCustomerNameSearch, status: orderStatusSearch, createdAt: { $gte: fromDate } }).sort({ createdAt: -1 });
                        }
                        else if (orderToDaySearch !== '') {
                            console.log('search by customer name, order status, to date');
                            var toDate = new Date(orderToDaySearch);
                            toDate = toDate.setHours(toDate.getHours() - 7 + 24);
                            toDate = new Date(toDate);
                            orderList = await Order.find({ fullname: orderCustomerNameSearch, status: orderStatusSearch, createdAt: { $lte: toDate } }).sort({ createdAt: -1 });
                        }
                        else {
                            console.log('search by customer name, order status');
                            orderList = await Order.find({ fullname: orderCustomerNameSearch, status: orderStatusSearch }).sort({ createdAt: -1 });
                        }
                    }
                    else {
                        if (orderFromDaySearch !== '' && orderToDaySearch !== '') {
                            console.log('search by customer name, from date and to date');
                            var fromDate = new Date(orderFromDaySearch);
                            fromDate = fromDate.setHours(fromDate.getHours() - 7);
                            fromDate = new Date(fromDate);
                            var toDate = new Date(orderToDaySearch);
                            toDate = toDate.setHours(toDate.getHours() - 7 + 24);
                            toDate = new Date(toDate);
                            orderList = await Order.find({ fullname: orderCustomerNameSearch, createdAt: { $gte: fromDate, $lte: toDate } }).sort({ createdAt: -1 });
                        }
                        else if (orderFromDaySearch !== '') {
                            console.log('search by customer name, from date');
                            var fromDate = new Date(orderFromDaySearch);
                            fromDate = fromDate.setHours(fromDate.getHours() - 7);
                            fromDate = new Date(fromDate);
                            orderList = await Order.find({ fullname: orderCustomerNameSearch, createdAt: { $gte: fromDate } }).sort({ createdAt: -1 });
                        }
                        else if (orderToDaySearch !== '') {
                            console.log('search by customer name, to date');
                            var toDate = new Date(orderToDaySearch);
                            toDate = toDate.setHours(toDate.getHours() - 7 + 24);
                            toDate = new Date(toDate);
                            orderList = await Order.find({ fullname: orderCustomerNameSearch, createdAt: { $lte: toDate } }).sort({ createdAt: -1 });
                        }
                        else {
                            console.log('search by customer name');
                            orderList = await Order.find({ fullname: orderCustomerNameSearch }).sort({ createdAt: -1 });
                        }
                    }
                }
                else if (orderStatusSearch !== 'Tất cả') {
                    if (orderFromDaySearch !== '' && orderToDaySearch !== '') {
                        console.log('search by order status, from date and to date');
                        var fromDate = new Date(orderFromDaySearch);
                        fromDate = fromDate.setHours(fromDate.getHours() - 7);
                        fromDate = new Date(fromDate);
                        var toDate = new Date(orderToDaySearch);
                        toDate = toDate.setHours(toDate.getHours() - 7 + 24);
                        toDate = new Date(toDate);
                        orderList = await Order.find({ status: orderStatusSearch, createdAt: { $gte: fromDate, $lte: toDate } }).sort({ createdAt: -1 });
                    }
                    else if (orderFromDaySearch !== '') {
                        console.log('search by order status, from date');
                        var fromDate = new Date(orderFromDaySearch);
                        fromDate = fromDate.setHours(fromDate.getHours() - 7);
                        fromDate = new Date(fromDate);
                        orderList = await Order.find({ status: orderStatusSearch, createdAt: { $gte: fromDate } }).sort({ createdAt: -1 });
                    }
                    else if (orderToDaySearch !== '') {
                        console.log('search by order status, to date');
                        var toDate = new Date(orderToDaySearch);
                        toDate = toDate.setHours(toDate.getHours() - 7 + 24);
                        toDate = new Date(toDate);
                        orderList = await Order.find({ status: orderStatusSearch, createdAt: { $lte: toDate } }).sort({ createdAt: -1 });
                    }
                    else {
                        console.log('search by order status');
                        orderList = await Order.find({ status: orderStatusSearch }).sort({ createdAt: -1 });
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
        else {
            console.log('orderList post not authorized');
        }
    }
    else {
        console.log('user not log in');
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