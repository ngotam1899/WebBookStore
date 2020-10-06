var express = require('express');
var router = express.Router();

//định nghĩa root
router.get('/', function(req, res){
    //res.render('index');
    res.redirect('/products')
})

var productsController = require('./../controllers/products');
router.get('/search', function(req,res){
    var query = req.query.query;
    productsController.search(query, function(products){
        res.locals.products = products;
        res.locals.count = products.length;
        res.locals.query = query;
        res.render('search');
    })
})



module.exports=router;
