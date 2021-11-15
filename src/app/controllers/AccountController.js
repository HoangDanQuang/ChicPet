const res = require("express/lib/response");
const User = require('../models/User');


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

module.exports.order_get = (req, res) => {
    if (res.locals.user) {
        if (res.locals.user.role === 'admin') {
            res.render('adminOrder');
        }
        else {
            res.render('accountOrder');
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