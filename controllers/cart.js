'use strict';

module.exports = function Cart(oldCart) {
    this.items = oldCart.items || {};   //items = products
    this.address = oldCart.address || {};
    this.paymentMethod = oldCart.paymentMethod || "COD";

    this.totalQuantity = () => {
        var quantity = 0;
        for (var id in this.items) {
            quantity += parseInt(this.items[id].quantity);
        }
        return quantity;
    };

    this.totalPrice = () => {
        var price = 0;
        for (var id in this.items) {
            price += parseFloat(this.items[id].price);
        }
        price = parseFloat(price).toFixed(2);
        return price;
    };

    this.add = (item, id) => {
        var storedItem = this.items[id];
        if (!storedItem) {
            this.items[id] = { item: item, quantity: 0, price: 0 };
            storedItem = this.items[id];
        }
        storedItem.item.price = parseFloat(storedItem.item.price);
        storedItem.quantity++;
        storedItem.price = parseFloat(storedItem.item.price * storedItem.quantity);
    };

    this.remove = (id) => {
        var storedItem = this.items[id];
        if (storedItem) {
            this.items[id] = undefined;
        }
    };

    this.update = (id, quantity) => {
        var storedItem = this.items[id];
        if (storedItem && quantity >= 1) {
            storedItem.quantity = quantity;
            storedItem.price = parseFloat(storedItem.item.price * storedItem.quantity);
        }
    };

    this.empty = () => {
        this.items = {};
    };

    this.generateArray = () => {
        var arr = [];
        for (var id in this.items) {
            this.items[id].item.price = parseFloat(this.items[id].item.price).toFixed(2);
            this.items[id].price = parseFloat(this.items[id].price).toFixed(2);
            arr.push(this.items[id]);
        }
        return arr;
    };
};