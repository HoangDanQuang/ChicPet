const res = require("express/lib/response");


module.exports.service_get = (req, res) => {
    res.render('service');
}

module.exports.book_get = (req, res) => {
    res.render('book');
}