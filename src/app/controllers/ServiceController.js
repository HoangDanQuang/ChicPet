const res = require("express/lib/response");
const Order = require('../models/Order');
const mongoose = require('mongoose');
const Service = require('../models/Service');

module.exports.service_get = async(req, res) => {
    try {
        const serviceList = await Service.find({}).sort({ createdAt: -1 }).limit(15).lean();
        if (serviceList) {
            console.log(serviceList);
            res.render('service', { services: serviceList });
        } else {
            console.log('serviceList Null');
        }
    } catch (err) {
        console.log('get service error');
        console.log(err);
    }
}
module.exports.postService_get = (req, res) => {
    res.render('postService');
}

//---------------------------------------------------------------------------

module.exports.postService_post = async(req, res) => {
    console.log('req.body: ' + req.body);

    /*     if (req.files == undefined) {
            return res.send({
              message: "You must select a file.",
            });
        }
        else{
            console.log(req.file)
        } */

    const { title, img, category, description, contentCode } = req.body;
    /*     var image = fs.readFileSync(req.file.path);
        var encode_image = image.toString('base64'); */
    try {
        var newService = new Service({
            /*  serviceCode: Date.now(), */
            title: title,
            img: img,
            category: category,
            description: description,
            /*  postingTime: Date.now(), */
            contentCode: contentCode
        });
        newService.save().then(result => {
            console.log('posting successful');
            console.log(newService);
            res.status(200).json({ service: newService });
        });
    } catch (err) {
        console.log('book_post error');
        console.log(err);
        var error = JSON.stringify({ error: err });
        res.status(400).json({ error });
    }
};


module.exports.detailService_get = async(req, res) => {
    console.log('service code: ', req.params.code);
    var objectId = mongoose.Types.ObjectId(req.params.code);
    console.log('objectID: ', objectId);
    try {
        const service = await Service.findOne({ _id: objectId }).lean();
        if (service) {
            console.log(service);
            res.render('detailService', { service: service });
        } else {
            console.log('service null');
        }
    } catch (err) {
        console.log('service detail error');
        console.log(err);
    }
}



//----------------------------------------------
module.exports.book_get = (req, res) => {
    res.render('book');
}

module.exports.book_post = async(req, res) => {
    const { name, phone, email, appointment, services, note } = req.body;

    try {
        if (req.session.user) {
            console.log('service controller req.session.user');
            console.log(req.session.user);
        } else console.log('service controller req.session.user NULL');
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
    } catch (err) {
        console.log('book_post error');
        console.log(err);
        var error = JSON.stringify({ error: err });
        res.status(400).json({ error });
    }
}

const generateOrderCode = () => {
    var orderCode = Date.now().toString();
    orderCode = orderCode.substring(orderCode.length - 9);
    return orderCode;
}