
var express = require('express');
var router = express.Router();

router.get('/', function(req, res){
    //xử lý view
    res.locals.cart='active';
    res.locals.shipping = '';
    res.locals.payment = '';

    //xử lý nội dung
    var cart = req.session.cart;        //lấy ra cart đc truyền
    res.locals.items = cart.generateArray();    //tạo cart
    res.locals.totalPrice = cart.totalPrice();  //tính total

    res.render('cart');
})

var productController = require('../controllers/products');
router.post('/', function(req,res){
    //phải truy vấn vào CSDL, lấy ra thông tin product
    var productId = req.body.id;
    productController.getById(productId, function(product){
        //thêm sản phẩm
        req.session.cart.add(product, product.id);
        res.sendStatus(204);
        res.end();
    })
})

//xóa sản phẩm
router.delete('/', function(req, res){
    var productId = req.body.id;
    req.session.cart.remove(productId);
    res.sendStatus(204);
    res.end();
})

//sửa sản phẩm
router.put('/', function(req, res){
    var productId = req.body.id;
    var quantity = parseInt(req.body.quantity);
    req.session.cart.update(productId, quantity);
    res.sendStatus(204);
    res.end();
})

router.get('/checkout', function(req, res){

    //truyền vào 1 biến để step cart kiểm tra dc khi nào active, completed
    res.render('checkout');
})

// Yêu cầu người dùng phải đăng nhập mới vào đc trang shipping
var userController = require('./../controllers/users');

router.get('/shipping', userController.isLoggedIn ,function(req, res){
    //xử lý view
    res.locals.cart='completed';
    res.locals.shipping = 'active';
    res.locals.payment = '';

    //xử lý nội dung
    var cart = req.session.cart;        //lấy ra cart đc truyền
    res.locals.items = cart.generateArray();    //tạo cart
    res.locals.totalPrice = cart.totalPrice();  //tính total

    res.render('users/shipping');
})
router.post('/payment',userController.isLoggedIn, function(req, res){
    //xử lý view
    res.locals.cart='completed';
    res.locals.shipping = 'completed';
    res.locals.payment = 'active';

    //xử lý nội dung
    var address = {
        // [Tên giống vs database trên PostgreSQL] :  req.body.[Tên của thuộc tính name trong tag form]
        firstname : req.body.first_name,
        lastname : req.body.last_name,
        email: req.body.email,
        phone: req.body.phone,
        address: req.body.address,
        state: req.body.state,
        zip: req.body.zip,
        country: req.body.country
    };
    req.session.cart.address=address;   //lưu các thông tin vào session
    //xử lý nội dung
    var cart = req.session.cart;        //lấy ra cart đc truyền
    res.locals.items = cart.generateArray();    //tạo cart
    res.locals.totalPrice = cart.totalPrice();  //tính total
    res.render('users/payment');
})

var orderController  = require('../controllers/orders');
router.post('/success', userController.isLoggedIn, function(req, res){
    var paymentMethod = req.body.paymentMethod;
    if(paymentMethod === 'COD'){
        //lưu payment vào session
        req.session.cart.paymentMethod = paymentMethod;
        //sau khi saveOrder thì hiện thông báo lên màn hình
        //Truyền các biến cart đã lưu trong session vào
        orderController.saveOrder(req.session.cart, req.session.user, function(){
            res.locals.paymentStatus ="PAYMENT COMPLETE";
            res.locals.paymentMessage = "Your payment is success";
            res.render('users/success');
        })
    }else{
        res.locals.paymentStatus ="PAYMENT FAIL";
        res.locals.paymentMessage = "Some error happen";
        res.render('users/success');
    }
})
module.exports= router;