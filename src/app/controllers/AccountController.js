const res = require("express/lib/response");
const User = require('../models/User');


module.exports.profile_get = (req, res) => {
    res.render('accountProfile');
}

module.exports.order_get = (req, res) => {
    res.render('accountOrder');
}