var express = require('express');
var router = express.Router();

var commentController = require('../controllers/comments');

router.post('/', function(req, res){
    var comment = {
        comment: req.body.comment,
        ProductId: req.body.ProductId
    };
    commentController.add(comment, function(){
        res.sendStatus(204);    //Thành công
        res.end();
    })
});

router.put('/:id', function(req, res){
    var comment = {
        id: req.params.id,
        comment: req.body.comment
    }
    commentController.update(comment, function(){
        res.sendStatus(204);
        res.end();
    })
});

router.delete('/:id', function(req, res){
    var id = req.params.id;
    commentController.delete(id, function(){
        res.sendStatus(204);
        res.end();
    });
});

module.exports= router;