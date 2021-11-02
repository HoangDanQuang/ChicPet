const res = require("express/lib/response");

class ServiceController {
    // [GET] /home
    index(req, res){
        res.render('service');
    }
}

module.exports = new ServiceController;