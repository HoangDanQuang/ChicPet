const res = require("express/lib/response");

class HomeController {
    index(req, res) {
        res.render('home');
    }
}

module.exports = new HomeController;