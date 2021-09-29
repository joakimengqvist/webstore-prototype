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

// Homepage
router.get('/', (req, res, next) => {
    // Fetching data from local json folder (acting as database)
    const dataRaw = fs.readFileSync(path.resolve(__dirname, 'productsdb.json'));
    const jsonData = JSON.parse(dataRaw)
    const data = jsonData.items
    // If Local session variable Cart has not been declared (new visitor) variable cart is created.
    if (req.session.cart == undefined) {
        req.session.cart = [];
    }
    // render Homepage with data and partial views
    res.render('home', {
        data,
        itemsInCart: req.session.cart,
        partials: {
            headerstart: 'partials/headerstart',
            footerdefault: 'partials/footerdefault'
        }
    })
})

// Homepage - changing amount of item in the shopping cart.
// - Used in /views/partials/headerstart.hjs
router.post('/additemamount', (req, res, next) => {
    const itemIdentifierChecker = req.body.itemIdIdentifier;
    const incart = req.body.incart

    // loops though items in the shopping cart
    for (var i = 0; i < req.session.cart.length; i++) {
        // if chosen product itemIdIdentifier Is found in shopping cart - this if statement is triggered
        if (itemIdentifierChecker == req.session.cart[i].itemIdIdentifier) {
            // returning chosen item that user wants to change incart on
            console.log('cart item before changing the value from users input (at home.js -> /additemamount): ' + req.session.cart[i].incart)
            // assign the chosen new value from user input to the incart variable in shopping cart
            req.session.cart[i].incart = incart
            // returning chosen item that user wants to change incart on and incart value
            console.log('cart item after changing the value from users input (should now be ' + incart + ') (at home.js -> /additemamount): ' + req.session.cart[i].incart)
            // if incart is less then 1 there is no products - this if statment is triggered -> removing chosen product object from shopping cart
            if (req.session.cart[i].incart < 1) {
                // returns length of cart before splice
                console.log('incart of product is < 1, therefor splice is run, this is cart length before splice (at home.js -> /additemamount): ' + req.session.cart.length)
                req.session.cart.splice(i, 1)
                // returns length of cart after splice
                console.log('incart of product is < 1, therefor splice is run, this is cart length after splice (at home.js -> /additemamount): ' + req.session.cart.length)
            }
        }
    }
    res.redirect('/')
})

// Homepage - Adding an item in the shopping cart.
// - Used in /views/partials/headerstart.hjs
router.get('/additem/:itemIdIdentifier', (req, res, next) => {
    const itemIdentifierChecker = req.params.itemIdIdentifier;
    // loops though items in the shopping cart
    for (var i = 0; i < req.session.cart.length; i++) {
        // if chosen product itemIdIdentifier Is found in shopping cart - this if statement is triggered
        if (itemIdentifierChecker == req.session.cart[i].itemIdIdentifier) {
            // return value of item before it has been modified
            console.log('value of incart before adding 1 (at home.js -> /additem/:itemIdentifier): ' + req.session.cart[i].incart)
            // Add 1 to current incart value in cart object for chosen product
            req.session.cart[i].incart++
            // return value of item after it has been modified
            console.log('value of incart after adding 1 (at home.js -> /additem/:itemIdentifier): ' + req.session.cart[i].incart)
            break;
        }
    }
    res.redirect('/')
})

// Homepage - Removing an item in the shopping cart.
// - Used in /views/partials/headerstart.hjs
router.get('/removeitem/:itemIdIdentifier', (req, res, next) => {
    const itemIdentifierChecker = req.params.itemIdIdentifier
    // loops though items in the shopping cart
    for (var i = 0; i < req.session.cart.length; i++) {
        // if chosen product itemIdIdentifier Is found in shopping cart - this if statement is triggered
        if (itemIdentifierChecker == req.session.cart[i].itemIdIdentifier) {
            // return value of item before it has been modified
            console.log('value of incart before subtracting 1 (at home.js -> /removeitem/:itemIdentifier): ' + req.session.cart[i].incart)
            // Subtract 1 to current incart value in cart object for chosen product
            req.session.cart[i].incart--
            // return value of item after it has been modified
            console.log('value of incart after subtracting 1 (at home.js -> /removeitem/:itemIdentifier): ' + req.session.cart[i].incart)
            // if incart is less then 1 there is no products - this if statment is triggered -> removing chosen product object from shopping cart
            if (req.session.cart[i].incart < 1) {
                // returns length of cart before splice
                console.log('incart of product is < 1, therefor splice is run, this is cart length before splice (at home.js -> /removeitem/:itemIdIdentifier): ' + req.session.cart.length)
                console.log('item that is being splices of is: ' + req.session.cart[i].itemIdIdentifier)
                req.session.cart.splice(i, 1)
                // returns length of cart after splice
                console.log('this is cart length after splice (at home.js -> /removeitem/:itemIdIdentifier): ' + req.session.cart.length)
            }
        }
    }
    res.redirect('/')
})

// Homepage - Remove all of chosen product in the shopping cart.
// - Used in /views/partials/headerstart.hjs
router.get('/removeallitems/:itemIdIdentifier', (req, res, next) => {
    const itemIdentifierChecker = req.params.itemIdIdentifier
    // loops though items in the shopping cart
    for (var i = 0; i < req.session.cart.length; i++) {
        // if chosen product itemIdIdentifier Is found in shopping cart - this if statement is triggered -> removing chosen product object from shopping cart
        if (itemIdentifierChecker == req.session.cart[i].itemIdIdentifier) {
            console.log('Removing all items of specific product is run, therefor splice is run, this is cart length before splice (at home.js -> /removeallitems/:itemIdIdentifier): ' + req.session.cart.length)
            console.log('item that is being spliced of is: ' + req.session.cart[i].itemIdIdentifier)
            req.session.cart.splice(i, 1)
            // returns length of cart after splice
            console.log('this is cart length after splice (at home.js -> /removeallitems/:itemIdIdentifier): ' + req.session.cart.length)
            break;
        }
    }
    res.redirect('/')
})

// Homepage - remove all object from shopping cart (reset)
// - Used in /views/partials/headerstart.hjs
router.get('/clearcart', (req, res, next) => {
    // returning cart before clearing
    console.log('cart before clearing (at home.js -> /clearcart): ' + req.session.cart)
    // Reset the shopping cart object to an empty array
    req.session.cart = []
    // returning cart after clearing
    console.log('cart after clearing (at home.js -> /clearcart): ' + req.session.cart)
    res.redirect('/')
})

// export module
module.exports = router