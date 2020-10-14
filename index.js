require('dotenv').config()
const express = require('express');
const app = express()

// const mongoose = require('mongoose');

// mongoose.connect(process.env.dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
//     .then(() => {
//         console.log('connected to db')
//     })


/*  Yahya   */
// const authRoutes = require('./routes/authRoutes')
const cookieSession = require('cookie-session')
require('./config/passport')
const passport = require('passport');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes')
const profileRoutes = require('./routes/profileRoutes')

//Database Connection
mongoose.connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('connected to db');
    })
app.use(cookieSession({
    name: 'session',
    maxAge: 24 * 60 * 60 * 1000,
    keys: [process.env.cookieKey]
}))

app.listen(process.env.PORT || 3000, () => {
    console.log('server listening at 3000')
})


app.use(express.static('public'))
app.use(passport.initialize())
app.use(passport.session())
app.use(express.static('public'))
app.use(express.json())
app.set('view engine', 'ejs')

app.use('/auth', authRoutes)
app.use('/profile', profileRoutes)

app.get('/', (req, res) => {
    res.render('index')
})









