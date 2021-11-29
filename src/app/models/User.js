const mongoose = require ('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');


const UserSchema = new Schema({
    role: {
        type: String,
        required: [true, 'User role not defined'],
    },
    username: {
        type: String,
        required: [true, 'Please enter a username'],
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: [true, 'Please enter a password'],
        minlength: [6, 'Minimum password length is 6 characters'],
    },
    fullname: {
        type: String,
        required: [true, 'Please enter your full name'],
    },
    phone: {
        type: String,
        required: [true, 'Please enter your phone number'],
    },
    mail: {
        type: String,
        required: [true, 'Please enter your email'],
    },
    address: {
        type: String,
    }
});

// fire a function before doc saved to db
// UserSchema.pre('save', async function(next) {
//     console.log('pre save userSchema');
//     const salt = await bcrypt.genSalt();
//     this.password = await bcrypt.hash(this.password, salt);
//     next();
// });

// static method to login user
UserSchema.statics.login = async function(username, password) {
    const user = await this.findOne({ username });
    if (user) {
      const auth = await bcrypt.compare(password, user.password);
      if (auth) {
        return user;
      }
      throw Error('Incorrect password');
    }
    throw Error('Incorrect username');
};

const User = mongoose.model('user', UserSchema);
module.exports = User;