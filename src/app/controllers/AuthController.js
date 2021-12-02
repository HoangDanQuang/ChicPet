const res = require("express/lib/response");
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
// const { deleteOne, exists } = require("./../models/User");


// handle errors
const handleErrors = (err) => {
    console.log(err.message, err.code);
    let errors = { username: '', password: '', confirmPassword: '', fullname: '', mail: '', phone: '' };
    
    // incorrect username
    if (err.message === 'Incorrect username') {
        errors.username = 'Username not registered';
        return errors;
    }
  
    // incorrect password
    if (err.message === 'Incorrect password') {
        errors.password = 'Incorrect password';
        return errors;
    }
  
    // duplicate username error
    if (err.code === 11000) {
        errors.username = 'Username already registered';
        return errors;
    }

    // password does not match
    if (err.message === "Password does not match") {
        errors.confirmPassword = "Password does not match";
        return errors;
    }
  
    // validation errors
    if (err.message.includes('user validation failed')) {
        console.log(err);
        Object.values(err.errors).forEach(({ properties }) => {
        // console.log(val);
        // console.log(properties);
        errors[properties.path] = properties.message;
        });
    }
  
    return errors;
}
  
// create json web token
const maxAge = 1 * 60 * 60;
const createToken = (id) => {
    return jwt.sign({ id }, 'ChicPet super secret password', {
        expiresIn: maxAge
    });
}



// Login Controller
module.exports.login_get = (req, res) => {
    res.render('login', {layout: 'layout2.hbs'});
}

module.exports.login_post = async (req, res) => {

    const { username, password } = req.body;

    try {
        const user = await User.login(username, password);
        const token = createToken(user._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
        res.status(200).json({ user: user._id });
    } 
    catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({ errors });
    }



    // let{tenDangNhap, matKhau} = req.body;
    // tenDangNhap.trim();
    // matKhau.trim();

    // if(tenDangNhap == "" || matKhau == "" ){
    //     req.session.message = {
    //         type: 'warning-custom',
    //         intro: 'Empty input fields!',
    //         message: 'Please try again!'
    //         }
    //         res.redirect('login'); 
    // }else{
    //     User.findOne({Username: tenDangNhap}).then(data => {
    //         if(data){
    //             const hashedPassword = data.Password;
    //             bcrypt.compare(matKhau, hashedPassword).then(result =>{
    //                 if(result){
    //                 res.redirect('home');
    //                 }else{
    //                 req.session.message = {
    //                     type: 'danger-custom',
    //                     intro: 'Incorrect password.',
    //                     message: 'Please try again!'
    //                     }
    //                     res.redirect('login'); 
    //                 }
    //             })
                
    //         }else{

    //             req.session.message = {
    //                 type: 'danger-custom',
    //                 intro: 'User is not exists.',
    //                 message: 'Please try again!'
    //                 }
    //                 res.redirect('login'); 
                
    //         }
    //     }).catch(err =>{
    //         console.log(err);
    //         req.session.message = {
    //             type: 'danger-custom',
    //             intro: 'An error occcured while checking for existing user!',
    //             message: 'Please try again!'
    //         }
    //             res.redirect('login'); 
    //     })
    // }
}

// Sign up
module.exports.signup_get = (req, res) => {
    res.render('signup', {layout: 'layout2.hbs'});
}

module.exports.signup_post = async (req, res) => {

    const { username, password, confirmPassword, fullname, phone, mail } = req.body;

    try {
        if (password != confirmPassword) throw Error('Password does not match');
        const salt = await bcrypt.genSalt();
        encryptedPassword = await bcrypt.hash(password, salt);
        const user = await User.create({ role: 'customer', userCode: generateUserCode(), username, password: encryptedPassword, fullname, phone, mail, address: '' });
        const token = createToken(user._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
        res.status(201).json({ user: user._id });
    }
    catch(err) {
        const errors = handleErrors(err);
        res.status(400).json({ errors });
    }




    // let {tenDangNhap, matKhau,xacNhanMatKhau, hoTen, soDienThoai, mail } = req.body;
    // tenDangNhap = tenDangNhap.trim();
    // matKhau = matKhau.trim();
    // hoTen = hoTen.trim();
    // soDienThoai = soDienThoai.trim();
    // mail = mail.trim();

    // if(tenDangNhap == "" || mail == "" || matKhau == "" || hoTen == "" || soDienThoai == ""){

    //     req.session.message = {
    //         type: 'warning-custom',
    //         intro: 'Empty input fields!',
    //         message: 'Please try again!'
    //         }
    //         res.redirect('signup'); 
    // }else if(!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(mail)){
        
    //     req.session.message = {
    //         type: 'danger-custom',
    //         intro: 'Invalid email entered!',
    //         message: 'Please try again!'
    //         }
    //         res.redirect('signup'); 
    // }else if(matKhau.lenght < 8){
    //     req.session.message = {
    //         type: 'warning-custom',
    //         intro: 'Password is too short!',
    //         message: 'Please try again!'
    //         }
    //         res.redirect('signup'); 
    // }else if(matKhau != xacNhanMatKhau){
        
    //     req.session.message = {
    //         type: 'danger-custom',
    //         intro: 'Password is different with repeat password!',
    //         message: 'Please try again!'
    //         }
    //         res.redirect('signup'); 
    // }else if(!/((09|03|07|08|05)+([0-9]{8})\b)/g.test(soDienThoai)){

    //     req.session.message = {
    //         type: 'danger-custom',
    //         intro: 'Invalid phone entered.',
    //         message: 'Please try again!'
    //         }
    //         res.redirect('signup'); 
    // }else{
    //     User.findOne({Username: tenDangNhap}).then(result => {
    //         if(result){

    //             req.session.message = {
    //                 type: 'warning-custom',
    //                 intro: 'User already exists.',
    //                 message: 'Please try again!'
    //                 }
    //                 res.redirect('signup'); 
    //         }else{
    //             //create new user
    //             const saltRound = 10;
    //             bcrypt.hash(matKhau, saltRound).then(hashedPassword =>{
    //                 const newUser = new User({
    //                     Username: tenDangNhap,
    //                     Password: hashedPassword,
    //                     Fullname: hoTen,
    //                     Phone: soDienThoai,
    //                     Mail: mail,
    //                     Address: '',
    //                 });
    //                 console.log(newUser);
    //                 newUser.save().then(result => {

    //                     req.session.message = {
    //                         type: 'success-custom',
    //                         intro: '',
    //                         message: 'Signup successful!'
    //                     }
    //                     res.redirect('signup'); 
    //                 })
    //                 .catch(err => {

    //                     req.session.message = {
    //                         type: 'danger-custom',
    //                         intro: 'An error occured while saving taiKhoan!',
    //                         message: 'Please try again!'
    //                         }
    //                         res.redirect('signup'); 
    //                 })
    //             })
    //             .catch(err => {

    //                 req.session.message = {
    //                     type: 'danger-custom',
    //                     intro: 'An error occured while hashing password!',
    //                     message: 'Please try again!'
    //                     }
    //                     res.redirect('signup'); 
    //             })
    //         }
    //     }).catch(err =>{
    //         console.log(err);
    //         req.session.message = {
    //             type: 'danger-custom',
    //             intro: 'An error occcured while checking for existing user!',
    //             message: 'Please try again!'
    //             }
    //             res.redirect('signup'); 
    //     })
    // }
}

const generateUserCode = () => {
    var orderCode = Date.now().toString();
    orderCode = orderCode.substring(orderCode.length - 9);
    return orderCode;
}

// Log out
module.exports.logout_get = (req, res) => {
    res.cookie('jwt', '', { maxAge: 1 });
    res.redirect('/');
}
