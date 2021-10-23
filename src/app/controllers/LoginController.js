const res = require("express/lib/response");

class LoginController {
    // [GET] /
    index(req, res){
        res.render('login', {layout: 'layout2.hbs'});
    }
}

module.exports = new LoginController;