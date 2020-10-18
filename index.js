require('dotenv').config()
const express = require('express');
const app = express()
const cookieSession = require('cookie-session')
require('./config/passport')
const passport = require('passport');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes')
const companyRoutes = require('./routes/companyRoutes')
const userRoutes = require('./routes/userRoutes')
const profileRoutes = require('./routes/profileRoutes')

mongoose.connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('connected to db');
        app.listen(process.env.PORT || 3000, () => {
            console.log('server listening at 3000')
        })
    })

app.use(cookieSession({
    name: 'session',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    keys: [process.env.cookieKey]
}))

app.use(passport.initialize())
app.use(passport.session())
app.use(express.static('public'))
app.use(express.static('uploads'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.set('view engine', 'ejs')

app.use('/auth', authRoutes)
app.use('/profile', profileRoutes)
app.use('/company', companyRoutes)
app.use('/user', userRoutes)
app.get('/', (req, res) => {
    res.render('index')
})

app.use((req, res) => {
    res.render('404')
})
