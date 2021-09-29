// Required imports from Express.js and Node.js
const express = require('express')
const path = require('path')
const session = require('express-session')

// Required imports from routes folders (Controllers)
const home = require('./routes/home')
const products = require('./routes/products')
const shoppingcart = require('./routes/shoppingcart')

// Define the App and use Express framework
const app = express()

// Information is stored serverside and correlated to a session ID which is saved as a cookie. 
// This is what keeps the data and information in memory while browsing the site, and aswell leaving and coming back within the session time.
// More into: http://expressjs.com/en/resources/middleware/session.html
app.use(session({
    secret: 'asidjoiwajsdjaslbjbhgf',
    resave: true,
    saveUninitialized: true
}))

// Declaring Views and navigation.
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'hjs')
app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(express.static(path.join(__dirname, 'public')))
app.use('/css', express.static(path.join(__dirname, 'public/css')));
app.use('/img', express.static(path.join(__dirname, 'public/images')));
app.use('/partials', express.static(path.join(__dirname, 'views/partials')));
app.use('/', home)
app.use('/products', products)
app.use('/shoppingcart', shoppingcart)

// Default error page for development.
app.use((err, req, res, next) => {
    res.render('error', {message:err.message})
})

// Run app locally for development on port 5000.
app.listen(5000)
console.log('App initiated - running locally on: http://localhost:5000')