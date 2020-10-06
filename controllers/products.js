var controller ={};

var models = require('./../models')
var Products = models.Product;

const {Op} = require("sequelize");

controller.getAll = function(callback){
    Products
    .findAll()
    .then((products)=>{
        products.forEach(product => {
            product.price = parseFloat(product.price).toFixed(2);
        });
        callback(products);
    })
    .catch((error)=>{})
}

controller.getById = function(id, callback){
    Products
    .findOne({
        where: {id: id},
        include: [models.Comment]
    })
    .then((product)=>{
        product.price = parseFloat(product.price).toFixed(2);
        callback(product);
    })
    .catch((error)=>{})
}

//SELECT * FROM Products WHERE name like '%'+query+'%' 
//OR summary like '%'+query+'%' OR description like '%'+query+'%' 
controller.search = function(query, callback) {
    Products
    .findAll({
        where: {
            [Op.or]: [
                {
                  name: {
                    [Op.iLike]: `%${query}%`
                  }
                },
                {
                  summary: {
                    [Op.like]: `%${query}%`
                  }
                },
                {
                    description: {
                    [Op.like]: `%${query}%`
                    }
                  }
              ]
        }
    }
    )
    .then(function(products){
        products.forEach(function(product) {
            product.price = parseFloat(product.price).toFixed(2);
        });
        callback(products);
    })
    .catch((error)=>{})
};

module.exports=controller;