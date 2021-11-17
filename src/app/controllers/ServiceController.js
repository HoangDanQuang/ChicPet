const res = require("express/lib/response");
const Order = require('../models/Order');


module.exports.service_get = (req, res) => {
    res.render('service');
}

module.exports.book_get = (req, res) => {
    res.render('book');
}

module.exports.book_post = async (req, res) => {
    const { name, phone, email, appointment, services, note} = req.body;

    try {

        if (res.locals.user) {
            var newOrder = new Order({
                orderCode: '#543736268',
                customerId: res.locals.user._id,
                fullname: name,
                phone: phone,
                mail: email,
                meetingTime: appointment,
                status: 'Chờ xác nhận',
                services: services,
                discount: 0,
                voucher: '',
                total: 0,
                note: note,
            });
            newOrder.save().then(result => {
                console.log('make order successful');
                console.log(newOrder);
                res.status(200).json({ order: newOrder });
            });
        }
        else {
            var newOrder = new Order({
                orderCode: '#543736268',
                customerId: null,
                fullname: name,
                phone: phone,
                mail: email,
                meetingTime: appointment,
                status: 'Chờ xác nhận',
                services: services,
                discount: 0,
                voucher: '',
                total: 0,
                note: note,
            });
            newOrder.save().then(result => {
                console.log('make order successful');
                console.log(newOrder);
                res.status(200).json({ order: newOrder });
            });
        }
    }
    catch(err) {
        console.log('book_post error');
        console.log(err);
        var error = JSON.stringify({ error: err });
        res.status(400).json({ error});
    }
}