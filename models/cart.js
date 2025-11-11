//fetch the previous this.Cart
const fs = require('fs');
const path = require('path');
const cartPath = path.join(
    path.dirname(process.mainModule.filename),
    'data',
    'cart.json'
);

module.exports = class Cart {
    //fetch the previous this.Cart;
    //analyse the cart and add product to it
    static addProduct(id, productPrice) {


        fs.readFile(cartPath, (err, fileContent) => {
            let cart = { products: [], totalPrice: 0 };

            if (!err) {
                cart = JSON.parse(fileContent);
            }

            //analyse the cart => find existing product
            const existingProductIndex = cart.products.findIndex(
                prod => prod.id === id
            );
            const existingProduct = cart.products[existingProductIndex];
            let updatedProduct;
            //add new product / increase quantity
            if (existingProduct) {
                updatedProduct = { ...existingProduct };
                updatedProduct.qty = updatedProduct.qty + 1;
                cart.products = [...cart.products];
                cart.products[existingProductIndex] = updatedProduct

            } else {
                updatedProduct = { id: id, qty: 1 };
                cart.products = [...cart.products, updatedProduct];
            }
            cart.totalPrice = cart.totalPrice + +productPrice;
            fs.writeFile(cartPath, JSON.stringify(cart), err => {
                console.log(err);
            });
        });
    }

    static deleteProduct(id, productPrice) {
        fs.readFile(cartPath, (err, fileContent) => {
            if (err) { //no cart
                return; //exit
            }
            const cart = JSON.parse(fileContent);
            const updatedCart = { ...cart };
            const product = updatedCart.products.find(prod => prod.id === id); //find the product
            if (!product) { //product not found
                return; //exit
            }
            const productQty = product.qty;
            updatedCart.products = updatedCart.products.filter(
                prod => prod.id !== id
            );
            updatedCart.totalPrice =
                updatedCart.totalPrice - productPrice * productQty;

            fs.writeFile(cartPath, JSON.stringify(updatedCart), err => {
                console.log(err);
            });
        });
    }

    static getCart(cb) {
        fs.readFile(cartPath, (err, fileContent) => {
            if (err) {
                cb(null);
            } else {
                const cart = JSON.parse(fileContent);
                cb(cart);
            }
        });
    }

    static getProducts(cb) { //fetch all products in the cart, cb is a callback
        fs.readFile(cartPath, (err, fileContent) => {
            if (err) {
                cb([]);
            } else {
                const cart = JSON.parse(fileContent);
                cb(cart.products);
            }
        });
    }
};