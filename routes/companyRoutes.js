const express = require('express')
const router = express.Router()
const Company = require('./../models/companies')

const checkAuth = (req, res, next) => {
    if (req.user.signUp) {
        res.redirect('/company/input01')
    } else {
        next()
    }
}

router.get('/', checkAuth, (req, res) => {
    console.log(req.user)
    res.render('companydashboard', { user: req.user })
})

router.get('/input01', (req, res) => {
    res.render('companyInput01')
})

router.post('/input01', (req, res) => {
    console.log(req.body)
    let update = {}
    update.companyName = req.body.companyName
    update.typeOfIndustry = req.body.typeOfIndustry
    let update1 = { $set: update }
    Company.findOneAndUpdate({ _id: req.user.id }, update1, { new: true, useFindAndModify: false })
        .then(result => {
            res.redirect('/company/input02')
        })
        .catch(err => console.error(`Failed to find and update document: ${err}`))
})

router.get('/input02', (req, res) => {
    res.render('companyInput02')
})

router.post('/input02', (req, res) => {
    console.log(req.body)
    let update = {}
    update.address = {
        street: req.body.street,
        postalcode: req.body.postalcode,
        city: req.body.city
    }
    let update1 = { $set: update }
    Company.findOneAndUpdate({ _id: req.user.id }, update1, { new: true, useFindAndModify: false })
        .then(result => {
            res.redirect('/company/input03')
        })
        .catch(err => console.error(`Failed to find and update document: ${err}`))
})

router.get('/input03', (req, res) => {
    res.render('companyInput03')
})

router.post('/input03', (req, res) => {
    console.log(req.body)
    let update = {}
    update.tables = []
    for (let i = 0; i < req.body.tables; i++) {
        update.tables.push("https://superinfotime.herokuapp.com/user/" + req.user.id + "/" + i)
    }
    let update1 = { $set: update }
    Company.findOneAndUpdate({ _id: req.user.id }, update1, { new: true, useFindAndModify: false })
        .then(result => {
            res.redirect('/company/input04')
        })
        .catch(err => console.error(`Failed to find and update document: ${err}`))
})

router.get('/input04', (req, res) => {
    res.render('companyInput04')
})

router.post('/input04', (req, res) => {
    console.log(req.body)
    let update = {}
    update.signUp = false
    let update1 = { $set: update }
    Company.findOneAndUpdate({ _id: req.user.id }, update1, { new: true, useFindAndModify: false })
        .then(result => {
            res.redirect('/company/inputlast')
        })
        .catch(err => console.error(`Failed to find and update document: ${err}`))
})

router.get('/inputlast', (req, res) => {
    res.render('companyInputlast')
})

module.exports = router
