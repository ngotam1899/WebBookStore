var express = require('express');
var router = express.Router();

var userController = require('../controllers/users');

router.get('/login', (req, res) => {
    req.session.returnURL = req.query.returnURL;
    res.render('login');
});

router.get('/register', (req, res) => {
    res.render('register');
});

router.get('/admin', userController.isAdmin, (req, res) => {
    res.render('users/admin');
});


router.post('/login', function(req, res) {
    //lấy thông tin Email/Password
    var email = req.body.email;
    var password = req.body.password;

    userController.getUserByEmail(email, function(user) {
        // kiểm tra email có tồn tại hay ko?
        if (!user) {
            res.render('login', { error: 'No email is found' });
        } else {
            //Kiểm tra password nhập vào có đúng vs password của user hay ko?
            userController.comparePassword(password, user.password, function(isMatch) {
                if (!isMatch) {
                    res.render('login', { error: 'Incorrect Password' });
                } else {
                    req.session.user = user;
                    // nếu trc đó đang thực hiện 1 trang khác r chuyển hướng tới trang Admin thì
                    // trả về trang trc đó sau khi login thành công
                    if (req.session.returnURL) {
                        res.redirect(req.session.returnURL);
                    } else {
                        //ngược lại trả về trang chủ
                        if (user.isAdmin === true) {
                            res.redirect('/users/admin');
                        } else {
                            res.redirect('/');
                        }
                    }
                }
            });
        }
    });
});

router.post('/register', function(req, res) {
    var name = req.body.name;
    var email = req.body.email;
    var password = req.body.password;
    var confirm = req.body.confirm;

    //1. validate (Module: express-validator)
    req.checkBody('name', 'Name is required').notEmpty();
    req.checkBody('email', 'Email is required').notEmpty();
    req.checkBody('email', 'Please enter a valid email').isEmail();
    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('confirm', 'Confirm Password is required').notEmpty();
    req.checkBody('confirm', 'Confirm Password must match wirh Password').equals(password);
    var errors = req.validationErrors();
    //nếu ko thỏa điều khiện thì trả về lỗi và trang register
    if (errors) {
        res.render('register', { errors: errors });
    } else {
        //nếu ko báo lỗi thì kiểm tra email đó đã có người dùng nào đăng ký hay chưa
        userController.getUserByEmail(email, function(user) {
            //nếu tồn tại user r thì báo lỗi
            if (user) {
                res.render('register', { error: `Email ${email} exists! Please choose another email.` });
            } else {
                // nếu chưa thì tạo mới user dự trên req.body
                var user = {
                    name: name,
                    email: email,
                    password: password,
                    isAdmin: false
                };
                userController.createUser(user, function(err) {
                    if (err) throw err;
                    //thông báo đăng ký thành công
                    res.render('login', { error: 'You have registered, now please login' });
                });
            }
        });
    }
});

router.get('/logout', function(req, res) {
    // gán lại cờ user trong session là null
    req.session.user = null;
    res.redirect('/users/login');
});

//2. Hiển thị lịch sử đơn hàng
var ordersController = require('../controllers/orders');
router.get('/orders', userController.isLoggedIn, function(req, res) {
    var user = req.session.user;
    ordersController.getByUser(user, (orders) => {
        res.locals.orders = orders;
        res.render('users/orderhistory');
    });
});

//3. Hiển thị chi tiết đơn hàng
router.get('/orders/:id', userController.isLoggedIn, function(req, res) {
    var id = req.params.id;
    ordersController.getById(id, (order) => {
        res.locals.order = order;
        ordersController.getDetailsByOrderId(id, (details) => {
            res.locals.details = details;
            res.render('users/orderdetails');
        });
    });
});

module.exports = router;