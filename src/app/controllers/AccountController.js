// const res = require("express/lib/response");

class AccountController {
    index(req, res) {
        res.render('account');
    }
}

module.exports = new AccountController;