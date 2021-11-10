const res = require("express/lib/response");
const TaiKhoan = require('../models/User');

class AccountController {
    index(req, res) {
        res.render('account');
    }

    info(req, res) {

        console.log('info');

        var accountInfo = TaiKhoan.findOne({ TenDangNhap: 'hoangdanquang'}).then(function(data) {
            if (data) {
                console.log(data);
                res.redirect(data);
            }
            else {
                console.log('cannot find account info');
                res.redirect(account);
            }
        });
    }

}

module.exports = new AccountController;