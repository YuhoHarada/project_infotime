const express = require('express')
const router = express.Router()
const Company = require('./../models/companies')
const Customer = require('./../models/customers')

router.get('/start/:companyID/:tableID/:randomNum', (req, res) => {
    Company.find({ _id: req.params.companyID, randomNum: req.params.randomNum })
        .then(result => {
            if (result.length > 0) {
                res.render('userAnmeldung', { companyID: req.params.companyID, tableID: req.params.tableID, companyName: result[0].companyName })
            } else {
                res.redirect('/404')
            }
        })
})

router.get('/userInfo/:companyID/:tableID', (req, res) => {
    res.render('userInfo', { companyID: req.params.companyID, tableID: req.params.tableID })
})

router.post('/userInfo/:companyID/:tableID', async (req, res) => {
    let from = new Date()
    let to = new Date()
    to.setHours(to.getHours() + 2)
    const result = await new Customer({
        companyId: req.params.companyID,
        table: req.params.tableID,
        userName: req.body.name,
        userStreet: req.body.street,
        userCode: req.body.postalcode,
        userCity: req.body.city,
        userPhone: req.body.phone,
        stayFrom: from,
        stayFromStr: `${("0" + from.getHours()).slice(-2)}:${("0" + from.getMinutes()).slice(-2)} ${("0" + from.getDate()).slice(-2)}.${("0" + (from.getMonth() + 1)).slice(-2)}.${from.getFullYear()}`,
        stayTo: to,
        stayToStr: `${("0" + to.getHours()).slice(-2)}:${("0" + to.getMinutes()).slice(-2)} ${("0" + to.getDate()).slice(-2)}.${("0" + (to.getMonth() + 1)).slice(-2)}.${to.getFullYear()}`
    }).save()
    res.status(201).redirect(`/user/menu/${req.params.companyID}/${req.params.tableID}/${result._id}`)
})

router.get(`/menu/:companyID/:tableID/:customerID`, (req, res) => {
    Company.findById(req.params.companyID)
        .then(result => {
            res.render('userCompanyInfo', { companyID: req.params.companyID, tableID: req.params.tableID, customerID: req.params.customerID, pdf: result.pdf })
        })
})

router.get('/faq', (req, res) => {
    res.render('userFaq')
})

router.get('/company/:companyID', (req, res) => {
    Company.findById(req.params.companyID)
        .then(result => {
            res.render('userCompanyAbout', { companyData: result })
        })
})

router.get('/logout/:customerID', (req, res) => {
    let to = new Date()
    let update = {
        stayTo: to,
        stayToStr: `${("0" + to.getHours()).slice(-2)}:${("0" + to.getMinutes()).slice(-2)} ${("0" + to.getDate()).slice(-2)}.${("0" + (to.getMonth() + 1)).slice(-2)}.${to.getFullYear()}`
    }
    let update1 = { $set: update }
    Customer.findOneAndUpdate({ _id: req.params.customerID }, update1, { new: true, useFindAndModify: false })
        .then(result => {
            res.render('userThanks')
        })
        .catch(err => console.error(`Failed to find and update document: ${err}`))
})

module.exports = router
