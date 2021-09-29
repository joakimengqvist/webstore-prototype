// Required imports from Express.js and Node.js.
const express = require('express')
const router = express.Router()
const path = require('path')
const fs = require('fs')

// ---------------------------------------------------------------------------------------------------------------------------
// INFD
//
// reqId variable is used for redirection purpose. 
// Current index position of chosen item is assigned to reqId and is used at the end of functions to redirect the user to product page.
//
// when page is rendered data and partial views are inserted to the view, 
// when redirecting data is not passed into view since this is done in the source where user is being directed.
//
// ---------------------------------------------------------------------------------------------------------------------------

// Product detail Page
// item ID as identification of products from json file[productsdb.json].
router.get('/itemsdetails/:itemid', (req, res, next) => {

    // Fetching data from local json folder (acting as database).
    const
        dataRaw = fs.readFileSync(path.resolve(__dirname, 'productsdb.json')),
        jsonData = JSON.parse(dataRaw),
        data = jsonData.items
    // If Local session variable Cart has not been declared (new visitor) variable cart is created.
    if (req.session.cart == undefined) {
        req.session.cart = [];
    }

    // defining object that stores the different options for the chosen product.
    req.session.optionsSetup = []

    // loops through the database.
    for (var i = 0; i < data.length; i++) {
        // if chosen product Id is found - this if statement is triggered.
        if (req.params.itemid == data[i].id) {
            // loops through options for chosen product.
            for (var p = 0; p < data[i].options.length; p++) {
                // if storage option is not undefined -> storage is an option for product -> this if statement is triggered.
                if ((data[i].options[0].storage !== undefined) || (data[i].options[0].storage != undefined)) {
                    // defining colors options and quantity of these.
                    var color = data[i].options[p].color
                    var quantity = data[i].options[p].quantity
                    // loops through all options
                    for (var n = 0; n < data[i].options[p].storage.length; n++) {
                        // defining an itemidentifier which is unique for every item and item options (string combining id, color and storage option)
                        var itemIdIdentifier = data[i].id + color + data[i].options[p].storage[n]
                        // adding product with options to optionsSetup.
                        req.session.optionsSetup.push({
                            "id": data[i].id,
                            "itemIdIdentifier": itemIdIdentifier,
                            "name": data[i].name,
                            "brand": data[i].brand,
                            "weight": data[i].weight,
                            "color": String(color),
                            "power": data[i].options[p].storage[n],
                            "storageunit": "GB",
                            "quantity": quantity,
                            "price": data[i].price,
                            "incart": 1
                        })
                    }
                    // if power is not undefined -> power is an option for product -> this if statement is triggered.
                } else if ((data[i].options[0].power !== undefined) || (data[i].options[0].power != undefined)) {
                    // defining colors options and quantity of these.
                    var color = data[i].options[p].color
                    var quantity = data[i].options[p].quantity
                    // loops through all options
                    for (var n = 0; n < data[i].options[p].power.length; n++) {
                        // defining an itemidentifier which is unique for every item and item options (string combining id, color and power option)
                        var itemIdIdentifier = data[i].id + color + data[i].options[p].power[n]
                        // adding product with options to optionsSetup.
                        req.session.optionsSetup.push({
                            "id": data[i].id,
                            "itemIdIdentifier": itemIdIdentifier,
                            "name": data[i].name,
                            "brand": data[i].brand,
                            "weight": data[i].weight,
                            "color": String(color),
                            "power": data[i].options[p].power[n],
                            "powerunit": "Hertz",
                            "quantity": quantity,
                            "price": data[i].price,
                            "incart": 1
                        })
                    }
                    // if both power and storage options are undefined there are no options for this - this else statement is therefor triggered if so.
                } else {
                    // defining colors options and quantity of these.
                    var color = data[i].options[p].color
                    var quantity = data[i].options[p].quantity
                    // defining an itemidentifier which is unique for every item and item options (string combining id and color)
                    var itemIdIdentifier = data[i].id + color
                    // adding product with options to optionsSetup.
                    req.session.optionsSetup.push({
                        "id": data[i].id,
                        "itemIdIdentifier": itemIdIdentifier,
                        "name": data[i].name,
                        "brand": data[i].brand,
                        "weight": data[i].weight,
                        "color": String(color),
                        "quantity": quantity,
                        "price": data[i].price,
                        "incart": 1
                    })
                }   
            }
            // Should always return all the different options the customer can choose from while browsing a product info page (detailed view)
            console.log('these are the options of chosen product (at projects.js -> /itemsdetails/:itemid):')
            for (var q = 0; q < req.session.optionsSetup.length; q++) {
                console.log(req.session.optionsSetup[q])
            }
            // renders detailed view with data from database, optionsSetup object for chosen product and the shopping cart data.
            res.render('products/itemsdetails', {
                data: data[i],
                optionsSetup: req.session.optionsSetup,
                itemsInCart: req.session.cart,
                partials: {
                    headerproductdetails: 'partials/headerproductdetails',
                    footerdefault: 'partials/footerdefault'
                }
            })
        }
    }
})

// Product detail Page
// Adding the chosen item with options and returning user to product detail page over the same product.
router.post('/additem', (req, res, next) => {
    // Fetching data from local json folder (acting as database).
    const
        dataRaw = fs.readFileSync(path.resolve(__dirname, 'productsdb.json')),
        jsonData = JSON.parse(dataRaw),
        itemIdentifierChecker = req.body.itemIdIdentifier
    var reqId
    // if 1 or more items excist in the shopping cart object - this if statement is triggered
    if (req.session.cart.length >= 1) {
        // Loops though shopping cart object
        for (var i = 0; i < req.session.cart.length; i++) {
            // if itemIdIdentifier Is found - this if statement is triggered
            if (req.session.cart[i].itemIdIdentifier == itemIdentifierChecker) {
                // return value of item before it has been modified
                console.log('item already excist in cart -> value of incart before adding 1 (at products.js -> /additem): ' + req.session.cart[i].incart)
                // add 1 in the "incart" attribute in shopping cart object
                req.session.cart[i].incart++
                console.log('value after incart before adding 1 (at products.js -> /additem): ' + req.session.cart[i].incart)
                reqId = req.session.cart[i].id
                break
            // If loop reaches last object in shopping cart - this else if statement is triggered
            } else if (i == req.session.cart.length-1) {
                // Loops through options object
                for (var o = 0; o < req.session.optionsSetup.length; o++) {
                    // if itemIdentifierChecker is the same as the itemIdIdentifier in specific options object within options object - this if statement is triggered
                    if (itemIdentifierChecker == req.session.optionsSetup[o].itemIdIdentifier) {
                        // add the specific object within option object to the shopping cart object
                        req.session.cart.push(req.session.optionsSetup[o])
                        console.log('This is the item that has been added by the user (at products.js -> /additem): ')
                        console.log(req.session.optionsSetup[o])
                        reqId = req.session.cart[i+1].id
                    }
                }
                break
            }
        }
    }
    // if shopping cart object is empty - this if statement is triggered
    if (req.session.cart.length < 1) {
        // loops through all object in the options object
        for (var i = 0; i < req.session.optionsSetup.length - 1; i++) {
            // if itemIdentifierChecker is the same as the itemIdIdentifier in specific options object within options object - this if statement is triggered
            if (itemIdentifierChecker == req.session.optionsSetup[i].itemIdIdentifier) {
                console.log('cart is empty, adding this products to cart (at products.js -> additem): ' + req.session.optionsSetup[i])
                // add the specific object within option object to the shopping cart object and set
                req.session.cart.push(req.session.optionsSetup[i])
                reqId = req.session.cart[0].id
            }
        }
    }
    // Should always return all the different objects the users has choosen to add to the cart
    console.log('This is the products in users cart (at products.js -> /additem):')
    console.log(req.session.cart);
    res.redirect('/products/itemsdetails/' + reqId)
})

// Product detail Page - changing amount of item in the shopping cart.
// - Used in /views/partials/headerproductdetails.hjs
router.post('/additemamount', (req, res, next) => {
    const itemIdentifierChecker = req.body.itemIdIdentifier
    const incart = req.body.incart
    var reqId

    // loops though items in the shopping cart
    for (var i = 0; i < req.session.cart.length; i++) {
        // if chosen product itemIdIdentifier Is found in shopping cart - this if statement is triggered
        if (itemIdentifierChecker == req.session.cart[i].itemIdIdentifier) {
            // returning chosen item that user wants to change incart on
            console.log('cart item before changing the value from users input (at products.js -> /additemamount): ' + req.session.cart[i].incart)
            // assign the chosen new value from user input to the incart variable in shopping cart
            req.session.cart[i].incart = incart
            // returning chosen item that user wants to change incart on and incart value
            console.log('cart item after changing the value from users input (should now be ' + incart + ') (at products.js -> /additemamount): ' + req.session.cart[i].incart)
            reqId = req.session.cart[i].id;
            // if incart is less then 1 there is no products - this if statment is triggered -> removing chosen product object from shopping cart
            if (req.session.cart[i].incart < 1) {
                // returns length of cart before splice
                console.log('incart of product is < 1, therefor splice is run, this is cart length before splice (at products.js -> /additemamount): ' + req.session.cart.length)
                req.session.cart.splice(i, 1)
                // returns length of cart after splice
                console.log('incart of product is < 1, therefor splice is run, this is cart length after splice (at products.js -> /additemamount): ' + req.session.cart.length)
            }
        }
    }
    res.redirect('/products/itemsdetails/' + reqId)
})

// Product detail Page - Adding an item in the shopping cart.
// - Used in /views/partials/headerproductdetails.hjs
router.get('/additem/:itemIdIdentifier', (req, res, next) => {
    var reqId;
    const itemIdentifierChecker = req.params.itemIdIdentifier
    // loops though items in the shopping cart
    for (var i = 0; i < req.session.cart.length; i++) {
        // if chosen product itemIdIdentifier Is found in shopping cart - this if statement is triggered
        if (itemIdentifierChecker == req.session.cart[i].itemIdIdentifier) {
            // return value of item before it has been modified
            console.log('value of incart before adding 1 (at products.js -> /additem/:itemIdentifier): ' + req.session.cart[i].incart)
            // Add 1 to current incart value in cart object for chosen product
            req.session.cart[i].incart++
            reqId = req.session.cart[i].id
            // return value of item after it has been modified
            console.log('value of incart after adding 1 (at products.js -> /additem/:itemIdentifier): ' + req.session.cart[i].incart)
            break;
        }
    }
    res.redirect('/products/itemsdetails/' + reqId)
})

// Product detail Page - Removing an item in the shopping cart.
// - Used in /views/partials/headerproductdetails.hjs
router.get('/removeitem/:itemIdIdentifier', (req, res, next) => {
    var reqId
    const itemIdentifierChecker = req.params.itemIdIdentifier
    // loops though items in the shopping cart
    for (var i = 0; i < req.session.cart.length; i++) {
        // if chosen product itemIdIdentifier Is found in shopping cart - this if statement is triggered
        if (itemIdentifierChecker == req.session.cart[i].itemIdIdentifier) {
            // return value of item before it has been modified
            console.log('value of incart before subtracting 1 (at products.js -> /removeitem/:itemIdentifier): ' + req.session.cart[i].incart)
            // Subtract 1 to current incart value in cart object for chosen product
            req.session.cart[i].incart--
            reqId = req.session.cart[i].id
            // return value of item after it has been modified
            console.log('value of incart after subtracting 1 (at products.js -> /removeitem/:itemIdentifier): ' + req.session.cart[i].incart)
            // if incart is less then 1 there is no products - this if statment is triggered -> removing chosen product object from shopping cart
            if (req.session.cart[i].incart < 1) {
                // returns length of cart before splice
                console.log('incart of product is < 1, therefor splice is run, this is cart length before splice (at products.js -> /removeitem/:itemIdIdentifier): ' + req.session.cart.length)
                console.log('item that is being splices of is: ' + req.session.cart[i].itemIdIdentifier)
                req.session.cart.splice(i, 1)
                // returns length of cart after splice
                console.log('this is cart length after splice (at products.js -> /removeitem/:itemIdIdentifier): ' + req.session.cart.length)
            }
        }
    }
    res.redirect('/products/itemsdetails/' + reqId)
})

// Product detail Page - Remove all of chosen product in the shopping cart.
// - Used in /views/partials/headerproductdetails.hjs
router.get('/removeallitems/:itemIdIdentifier', (req, res, next) => {
    const itemIdentifierChecker = req.params.itemIdIdentifier;
    // loops though items in the shopping cart
    for (var i = 0; i < req.session.cart.length; i++) {
        // if chosen product itemIdIdentifier Is found in shopping cart - this if statement is triggered -> removing chosen product object from shopping cart
        if (itemIdentifierChecker == req.session.cart[i].itemIdIdentifier) {
            console.log('Removing all items of specific product is run, therefor splice is run, this is cart length before splice (at products.js -> /removeallitems/:itemIdIdentifier): ' + req.session.cart.length)
            console.log('item that is being spliced of is: ' + req.session.cart[i].itemIdIdentifier)
            req.session.cart.splice(i, 1)
            // returns length of cart after splice
            console.log('this is cart length after splice (at products.js -> /removeallitems/:itemIdIdentifier): ' + req.session.cart.length)
            break;
        }
    }
    res.redirect('/')
})

router.get('/clearcart', (req, res, next) => {
    // returning cart before clearing
    console.log('cart before clearing (at products.js -> /clearcart): ' + req.session.cart)
    // Reset the shopping cart object to an empty array
    req.session.cart = []
    // returning cart after clearing
    console.log('cart after clearing (at products.js -> /clearcart): ' + req.session.cart)
    res.redirect('/')
})

// export module
module.exports = router