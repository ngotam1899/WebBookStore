var express= require('express');
var app = express();

//Thư viện trả về các status code lên server
//lưu lại các thao tác mà phía client gửi cho server
/* const morgan= require('morgan');
app.use(morgan('dev',{
    skip: (req,res) => res.statusCode < 400,
    stream: process.stderr
}));
//Khi nào có lỗi >=400 sẽ trả về console.log(error) cho server
app.use(morgan('dev',{
    skip: (req,res) => res.statusCode >= 400,
    stream: process.stdout
})); */

//đưa trang index.html vào
app.use(express.static(__dirname + '/public'));

//view engine
//FORMATE DATE
function formateDate(date){
    return date.toLocaleString('en-US');
}
//HANDLEBARS
var expressHbs = require('express-handlebars');
//Sửa lỗi handlebar bản mới nhất
const Handlebars = require('handlebars');
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');

var paginateHelper = require('express-handlebars-paginate');
var handlebars  = expressHbs.create({
    extname:'hbs',
    defaultLayout:'layout',
    layoutsDir: __dirname + '/views/layouts',
    partialsDir: __dirname + '/views/partials',
    handlebars: allowInsecurePrototypeAccess(Handlebars),
    helpers:{
        paginate: paginateHelper.createPagination,
        formateDate,

    }
})
app.engine('hbs', handlebars.engine);
app.set('view engine', 'hbs');

//lấy dữ liệu từ phương thức POST
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

//xử lý cookie/session vs cart
var cookieParser = require('cookie-parser');
app.use(cookieParser());

var session = require('express-session');
app.use(session({
    cookie: {
        httpOnly:true, 
        maxAge: 30*24*60*60*1000    //tồn tại trong 30 ngày
    },
    secret: "Secret",                // chuổi kiểm tra
    resave: false,                   //ko cần lưu lại sau 30 ngày
    saveUninitialized: false,
}));

//Cấu hình sử dụng express-validator
var expressValidator = require('express-validator');
app.use(expressValidator());

//Middleware xử lý gán vào session (trc khi load mỗi route đều đc xử lý)
var Cart = require('./controllers/cart');
app.use(function(req,res,next){
    //nếu có giỏ hàng trong session thì lấy ra ngược lại thì truyền rỗng
    var cart = new Cart(req.session.cart ? req.session.cart : {});
    res.locals.cartItemCount = cart.totalQuantity();
    req.session.cart = cart;

    res.locals.user = req.session.user;
    res.locals.isLoggedIn = req.session.user ? true : false;
    
    next();
});

//tạo Database - chỉ chạy 1 lần đầu thôi
app.get('/sync',(req,res)=>{
    let models=require('./models');
    models.sequelize.sync().then(()=>{
        res.send(`Database sync completed`);
    });
});

//Root router
var indexRouter = require('./routes/index');
app.use('/',indexRouter);

//các router
var userRouter = require('./routes/users');
app.use('/users', userRouter);

var cartRouter = require('./routes/cart');
app.use('/cart', cartRouter);

var productsRouter = require('./routes/products');
app.use('/products', productsRouter);

/* Route xử lý các thao tác Thêm, Sửa, Xóa comment          */
/* Thêm - POST     /comments        {comment,ProductIs}     */
/* Sửa  - PUT      /comments/:id    {comment}               */
/* Xóa  - DELETE   /comments/:id                            */
var commentRouter = require('./routes/comments');
app.use('/comments', commentRouter);

//xử lý lỗi
// Error handler
// Handle 404 Not found
app.use(function(req, res){
	res.locals.message = 'File Not Found';
	res.status(404).render('error');
});

// Handle 500 Internal Server Error
app.use(function(err, req, res, next) {
    console.log(err);   
    //lỗi server thì phải console cho server bik là lỗi gì
	res.locals.message = 'Internal Server Error';
	res.status(500).render('error');
});

//tạo port
app.set('port', process.env.PORT || 5000);
app.listen(app.get('port'), function(){
    console.log('Server is listening at port ' + app.get('port'));
});