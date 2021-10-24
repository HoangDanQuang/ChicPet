const res = require("express/lib/response");
const TaiKhoan = require('./../models/taikhoan');
const bcrypt = require('bcrypt');

class SignupController {
    // [GET] /

    index(req, res){
        res.render('signup', {layout: 'layout2.hbs'});
    }

    signup(req,res){
        let {tenDangNhap, matKhau,xacNhanMatKhau, hoTen, soDienThoai, mail } = req.body;
        tenDangNhap = tenDangNhap.trim();
        matKhau = matKhau.trim();
        hoTen = hoTen.trim();
        soDienThoai = soDienThoai.trim();
        mail = mail.trim();

        if(tenDangNhap == "" || mail == "" || matKhau == "" || hoTen == "" || soDienThoai == ""){
            res.json({
                status: "FAILED",
                message: "Empty input fields!"
            });
        }else if(!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(mail)){
            res.json({
                status: "FAILED",
                message: "Invalid email entered"
            });
        }else if(matKhau.lenght < 8){
            res.json({
                status: "FAILED",
                message: "Password is too short!"
            });
        }else if(matKhau != xacNhanMatKhau){
            res.json({
                status: "FAILED",
                message: "Password is different with repeat password!"
            });
        }else if(!/((09|03|07|08|05)+([0-9]{8})\b)/g.test(soDienThoai)){
            res.json({
                status: "FAILED",
                message: "Invalid phone entered"
            });
        }else{
            TaiKhoan.find({TenDangNhap: tenDangNhap}).then(result => {
                if(result){
                    res.json({
                        status: "FAILED",
                        message: "User already exists"
                    })
                }else{
                    //create new user
                    const saltRound = 10;
                    bcrypt.hash(matKhau, saltRound).then(hashedPassword =>{
                        const newUser = new TaiKhoan({
                            TenDangNhap: tenDangNhap,
                            MatKhau: hashedPassword,
                            HoTen: hoTen,
                            SoDienThoai: soDienThoai,
                            Mail: mail
                        });
                        newUser.save().then(result => {
                            res.json({
                                status: "SUCCESS",
                                message: "Signup successful",
                                data: result,
                            })
                            res.render('/login', {layout: 'layout2.hbs'});
                        })
                        .catch(err => {
                            res.json({
                                status: "FAILED",
                                message: "An error occured while saving taiKhoan!"
                            })
                        })
                    })
                    .catch(err => {
                        res.json({
                            status: "FAILED",
                            message: "An error occured while hashing password!"
                        })
                    })
                }
            }).catch(err =>{
                console.log(err);
                res.json({
                    status: "FAILED",
                    message: "An error occcured while checking for existing user!"
                })
            })
        }
    }
    
}

module.exports = new SignupController;