const res = require("express/lib/response");
const TaiKhoan = require('./../models/taikhoan');
const bcrypt = require('bcrypt');

class LoginController {
    // [GET] /
    index(req, res){
        res.render('login', {layout: 'layout2.hbs'});
    }
    login(req, res){
        let{tenDangNhap, matKhau} = req.body;
        tenDangNhap.trim();
        matKhau.trim();

        if(tenDangNhap == "" || matKhau == "" ){
            res.json({
                status: "FAILED",
                message: "Empty input fields!"
            });
        }else{
            TaiKhoan.find({TenDangNhap: tenDangNhap}).then(data => {
                if(data){
                   const hashedPassword = data[0].MatKhau;
                   bcrypt.compare(matKhau, hashedPassword).then(result =>{
                       if(result){
                       /*  res.json({
                            status: "SUCCESS",
                            message: "Login success",
                            data: data
                        }) */
                        res.render('home');
                       }
                   })
                    
                }else{
                    res.json({
                        status: "FAILED",
                        message: "User not exists"
                    })
                }
            }).catch(err =>{
                console.log(err);
                res.json({
                    status: "FAILED",
                    message: "An error occcured while checking for existing user!",
                })
            })
        }

    }
}

module.exports = new LoginController;