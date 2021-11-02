const res = require("express/lib/response");
const TaiKhoan = require('./../models/taikhoan');

class AccountController {
    index(req, res) {
        
        console.log('index');

        // var account = new TaiKhoan({
        //     TenDangNhap: 'hoangdanquang',
        //     MatKhau: 'matkhau',
        //     HoTen: 'Hoàng Dận Quang',
        //     SoDienThoai: '0123456789',
        //     Mail: 'hoangdanquang@gmail.com'
        // });

        // account.save().then(function() {
        //     if (account.isNew === false) {
        //         TaiKhoan.findOne({ TenDangNhap: 'hoangdanquang'}).then(function(result) {
        //             console.log(result);
        //         });
        //     }
        //     else console.log('cannot find account');
        // });

        
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