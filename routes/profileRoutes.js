const express = require('express');
const router = express.Router()

const checkAuth = (req, res, next) => {
    if (req.user) {
        next()
    } else {
        res.redirect('/company/input01')
    }
}

router.get('/', checkAuth, (req, res) => {
    res.render('companydashboard', { user: req.user })
})

module.exports = router