var express = require('express');
var router = express.Router();

var controller = require('../controllers/products');

router.get('/', function(req, res){
    controller.getAll((products)=>{
        res.locals.products = products;
        res.render('index');
    })
})
router.get('/:id', function(req, res){
    //lấy :id của req
    var id = req.params.id;
    controller.getById(id, (product)=>{
        //phân trang
        var page= parseInt(req.query.page);
        page = isNaN(page) ? 1 : page       //đặt page mặc định là 1
        //1 trang có tối đa 5 comment
        var limit = 3;
        var pagination ={
            limit:limit,
            page:page,
            totalRows : product.Comments.length
        };
        var offset = (page-1)*limit;    //id của comment đầu của mỗi page
        //gán lại số lượng comment cho từng trang
        product.Comments = product.Comments
        //sắp xếp theo thời gian mới mất
        .sort((a,b)=>{
            return b.updatedAt.getTime() - a.updatedAt.getTime()
        })
        //phân mảng
        .slice(offset, offset+limit);
        
        //kiểm tra có đủ comment hay ko, để show lên pagination
        res.locals.hasPagination = (pagination.totalRows/limit > 1);

        res.locals.pagination = pagination;
        res.locals.product=product;
        res.render('details');
    })
})
module.exports= router;