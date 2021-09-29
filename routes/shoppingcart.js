// Required imports from Express.js and Node.js
const express = require('express')
const router = express.Router()
const path = require('path')
const fs = require('fs')

// ---------------------------------------------------------------------------------------------------------------------------
//
// INFD
//
// when page is rendered data and partial views are inserted to the view, 
// when redirecting data is not passed into view since this is done in the source where user is being directed.
//
// ---------------------------------------------------------------------------------------------------------------------------

router.get('/', (req, res, next) => {
    // If Local session variable Cart has not been declared (new visitor) variable cart is created.
    if (req.session.cart == undefined) {
        req.session.cart = [];
    }
    // defining price and amount of products object for checkout
    req.session.checkOutSummary = [{ "totalPrice": 0 }, { "antal": 0 }]
    // loops though items in the shopping cart
    for (var n = 0; n < req.session.cart.length; n++) {
        // All calculation data is converted to integers for avoiding calculation error or incorrect calculations
        // Totalprice = TotalPrice + (chosen product price * amount in cart (incart))
        // Total amount of products = Total amount of products + amount in cart (incart)
        req.session.checkOutSummary[0].totalPrice = parseInt(req.session.checkOutSummary[0].totalPrice, 10) + (parseInt(req.session.cart[n].price, 10) * req.session.cart[n].incart)
        req.session.checkOutSummary[1].antal = parseInt(req.session.checkOutSummary[1].antal, 10) + parseInt(req.session.cart[n].incart, 10)
    }
    res.render('account/shoppingcart', {
        itemsInCart: req.session.cart,
        checkOutSummaryPrice: req.session.checkOutSummary[0].totalPrice,
        checkOutSummaryStock: req.session.checkOutSummary[1].antal,
        partials: {
            headercart: 'partials/headercart',
            footerdefault: 'partials/footerdefault'
        }
    })
})

// Shopping cart page - changing amount of item in the shopping cart.
// - Used in /views/partials/headercart.hjs
router.post('/additemamount', (req, res, next) => {
    const itemIdentifierChecker = req.body.itemIdIdentifier;
    const incart = req.body.incart

    // loops though items in the shopping cart
    for (var i = 0; i < req.session.cart.length; i++) {
        // if chosen product itemIdIdentifier Is found in shopping cart - this if statement is triggered
        if (itemIdentifierChecker == req.session.cart[i].itemIdIdentifier) {
            // returning chosen item that user wants to change incart on
            console.log('cart item before changing the value from users input (at shoppingcart.js -> /additemamount): ' + req.session.cart[i].incart)
            // assign the chosen new value from user input to the incart variable in shopping cart
            req.session.cart[i].incart = incart
            // returning chosen item that user wants to change incart on and incart value
            console.log('cart item after changing the value from users input (should now be ' + incart + ') (at shoppingcart.js -> /additemamount): ' + req.session.cart[i].incart)
            // if incart is less then 1 there is no products - this if statment is triggered -> removing chosen product object from shopping cart
            if (req.session.cart[i].incart < 1) {
                // returns length of cart before splice
                console.log('incart of product is < 1, therefor splice is run, this is cart length before splice (at shoppingcart.js -> /additemamount): ' + req.session.cart.length)
                req.session.cart.splice(i, 1)
                // returns length of cart after splice
                console.log('incart of product is < 1, therefor splice is run, this is cart length after splice (at shoppingcart.js -> /additemamount): ' + req.session.cart.length)
            }
        }
    }
    res.redirect('/shoppingcart')
})

// Shopping cart page - Adding an item in the shopping cart.
// - Used in /views/partials/headercart.hjs
router.get('/additem/:itemIdIdentifier', (req, res, next) => {
    const itemIdentifierChecker = req.params.itemIdIdentifier
    // loops though items in the shopping cart
    for (var i = 0; i < req.session.cart.length; i++) {
        // if chosen product itemIdIdentifier Is found in shopping cart - this if statement is triggered
        if (itemIdentifierChecker == req.session.cart[i].itemIdIdentifier) {
            // return value of item before it has been modified
            console.log('value of incart before adding 1 (at shoppingcart.js -> /additem/:itemIdentifier): ' + req.session.cart[i].incart)
            // Add 1 to current incart value in cart object for chosen product
            req.session.cart[i].incart++
            // return value of item after it has been modified
            console.log('value of incart after adding 1 (at shoppingcart.js -> /additem/:itemIdentifier): ' + req.session.cart[i].incart)
            break;
        }
    }
    res.redirect('/shoppingcart')
})

// Shopping cart page - Removing an item in the shopping cart.
// - Used in /views/partials/headercart.hjs
router.get('/removeitem/:itemIdIdentifier', (req, res, next) => {
    const itemIdentifierChecker = req.params.itemIdIdentifier
    // loops though items in the shopping cart
    for (var i = 0; i < req.session.cart.length; i++) {
        // if chosen product itemIdIdentifier Is found in shopping cart - this if statement is triggered
        if (itemIdentifierChecker == req.session.cart[i].itemIdIdentifier) {
            // return value of item before it has been modified - 
            console.log('value of incart before subtracting 1 (at shoppingcart.js -> /removeitem/:itemIdentifier): ' + req.session.cart[i].incart)
            // Subtract 1 to current incart value in cart object for chosen product
            req.session.cart[i].incart--
            // return value of item after it has been modified
            console.log('value of incart after subtracting 1 (at shoppingcart.js -> /removeitem/:itemIdentifier): ' + req.session.cart[i].incart)
            // if incart is less then 1 there is no products - this if statment is triggered -> removing chosen product object from shopping cart
            if (req.session.cart[i].incart < 1) {
                // returns length of cart before splice
                console.log('incart of product is < 1, therefor splice is run, this is cart length before splice (at shoppingcart.js -> /removeitem/:itemIdIdentifier): ' + req.session.cart.length)
                console.log('item that is being splices of is: ' + req.session.cart[i].itemIdIdentifier)
                req.session.cart.splice(i, 1)
                // returns length of cart after splice
                console.log('incart of product is < 1, therefor splice is run, this is cart length after splice (at shoppingcart.js -> /removeitem/:itemIdIdentifier): ' + req.session.cart.length)
            }
        }
    }
    res.redirect('/shoppingcart')
})

// Shopping cart page - Remove all of chosen product in the shopping cart.
// - Used in /views/partials/headercart.hjs
router.get('/removeallitems/:itemIdIdentifier', (req, res, next) => {
    const itemIdentifierChecker = req.params.itemIdIdentifier;
    // loops though items in the shopping cart
    for (var i = 0; i < req.session.cart.length; i++) {
        // if chosen product itemIdIdentifier Is found in shopping cart - this if statement is triggered -> removing chosen product object from shopping cart
        if (itemIdentifierChecker == req.session.cart[i].itemIdIdentifier) {
            console.log('Removing all items of specific product is run, therefor splice is run, this is cart length before splice (at shoppingcart.js -> /removeallitems/:itemIdIdentifier): ' + req.session.cart.length)
            console.log('item that is being spliced of is: ' + req.session.cart[i].itemIdIdentifier)
            req.session.cart.splice(i, 1)
            // returns length of cart after splice
            console.log('this is cart length after splice (at shoppingcart.js -> /removeallitems/:itemIdIdentifier): ' + req.session.cart.length)
            break
        }
    }
    res.redirect('/shoppingcart')
})

// Shopping cart page - remove all object from shopping cart (reset)
// - Used in /views/partials/headercart.hjs
router.get('/clearcart', (req, res, next) => {
    // returning cart before clearing
    console.log('cart length before clearing (at shoppingcart.js -> /clearcart): ' + req.session.cart.length)
    // Reset the shopping cart object to an empty array
    req.session.cart = []
    // returning cart after clearing
    console.log('cart length after clearing (at shoppingcart.js -> /clearcart): ' + req.session.cart.length)
    res.redirect('/shoppingcart')
})

// export module
module.exports = router