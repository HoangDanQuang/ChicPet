const res = require("express/lib/response");

class SignupController {
    // [GET] /
    index(req, res){
        res.render('signup', {layout: 'layout2.hbs'});
    }
}

module.exports = new SignupController;