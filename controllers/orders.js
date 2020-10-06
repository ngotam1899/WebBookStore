var controller = {};

var models = require('../models');

// CSDL
// Address
// Order
// OrderDetails
controller.saveOrder = function(cart,user, callback) {
  models.Address
  .create(cart.address)
  .then(function(newAddress) {
		var order = {
			totalQuantity: cart.totalQuantity(),
			ttaloPrice: cart.totalPrice(),
			//lấy ra paymentMethod đã lưu vào session
			paymentMethod: cart.paymentMethod,
			status: 'Processing',
			//lưu địa chỉ
			AddressId: newAddress.id,
			UserId: user.id
		};
    //lưu đơn hàng
    models.Order
    .create(order)
    .then(function(newOrder) {
			var items = cart.generateArray();
			items.forEach(function(item) {
				var detail = {
					price: item.price,
					quantity: item.quantity,
					ProductId: item.item.id,
					OrderId: newOrder.id
				};

				models.OrderDetail.create(detail);
			});

			// Lưu rồi thì xóa giỏ hàng
			cart.empty();
			callback();
		});
	});
};

controller.getByUser = (user, callback) => {
	models.Order
		.findAll({
			where: { UserId: user.id }
		})
		.then((orders) => {
			callback(orders);
		});
};

controller.getDetailsByOrderId = (id, callback) => {
	models.OrderDetail
		.findAll({
			where: { OrderId: id },
			include: models.Product
		})
		.then((details) => {
			details.forEach(function(detail) {
				detail.Product.price = parseFloat(detail.Product.price).toFixed(2);
			});
			callback(details);
		});
};

controller.getById = (id, callback) => {
	models.Order
		.findOne({
			where: { id: id },
			include: models.Address
		})
		.then((order) => {
			callback(order);
		});
};

module.exports = controller;
