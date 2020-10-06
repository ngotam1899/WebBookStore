var controller = {}
var models = require('./../models');
var Comments = models.Comment;

controller.add = function(comment, callback){
    Comments
    .create(comment)
    .then(callback)
    .catch((error)=>{});
};

controller.update = function(comment, callback){
    Comments
    .update({
        comment: comment.comment
    },{
        where: {id: comment.id}
    })
    .then(callback)
    .catch((error)=>{});
};

controller.delete = function(id, callback){
    Comments
    .destroy({
        where:{id:id}
    })
    .then(callback)
    .catch((error)=>{});
};

module.exports=controller;