var controller = {};

var models = require('../models');
var bcrypt = require('bcryptjs');

//Tạo tài khoản User
controller.createUser = function(user, callback) {
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(user.password, salt, function(err, hash) {
            user.password = hash;
            models.User
                .create(user)
                .then(function() {
                    callback(err);
                });
        });
    });
};

//Kiểm tra tài khoản dựa vào địa chỉ email
controller.getUserByEmail = function(email, callback) {
    let Obj = { email: email }
    models.User
        .findOne({ where: Obj })
        .then(function(user) {
            callback(user);
        })
        .catch(function(err) {
            if (err) throw err;
            callback(null);
        });
};

//So sánh mật khẩu: 
// Người dùng nhập vào mật khẩu chưa mã hóa, so sánh vs mật khẩu đã đc mã hóa
controller.comparePassword = function(password, hash, callback) {
    bcrypt.compare(password, hash, function(err, isMatch) {
        if (err) throw err;
        callback(isMatch);
    });
};

//Lấy thông tin user dựa vào Id
controller.getUserById = function(id, callback) {
    models.User
        .findById(id)
        .then(function(user) {
            callback(false, user);
        });
}

//Middleware: 
//1. Kiễm tra người dùng đã đăng nhập hay chưa
controller.isLoggedIn = (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        //lưu thông tin đường dẫn trc đó của người dùng
        res.redirect(`/users/login?returnURL=${req.originalUrl}`);
    }
};
//2. Kiểm tra người dùng có phải admin hay ko?
controller.isAdmin = (req, res, next) => {
    if (req.session.user && req.session.user.isAdmin) {
        next();
    } else {
        res.status(403);
        res.end();
    }
};

module.exports = controller;