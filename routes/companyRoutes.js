const express = require('express')
const router = express.Router()
const Company = require('./../models/companies')
const QRCode = require('qrcode')
const formidable = require("formidable")
const path = require('path')
const Customer = require('./../models/customers')

const checkAuth = (req, res, next) => {
    if (req.user.signUp) {
        res.redirect('/company/input01')
    } else {
        next()
    }
}

router.get('/', checkAuth, (req, res) => {
    Customer.find({ companyId: req.user.id })
        .then(result => {
            res.render('companydashboard', { user: req.user, customer: result })
        })
})

router.get('/input01', (req, res) => {
    res.render('companyInput01', { user: req.user })
})

router.post('/input01/:isFirst', (req, res) => {
    console.log(req.body)
    const form = formidable({
        uploadDir: "./uploads",
        keepExtensions: true
    })
    form.parse(req, (err, fields, files) => {
        if (err) {
            next(err);
            return;
        }
        let update = {}
        update.companyName = fields.companyName
        if (files.logo.size != "") {
            update.logo = '/' + path.basename(files.logo.path)
        }
        update.typeOfIndustry = fields.typeOfIndustry
        let update1 = { $set: update }
        Company.findOneAndUpdate({ _id: req.user.id }, update1, { new: true, useFindAndModify: false })
            .then(result => {
                if (req.params.isFirst == "first") {
                    res.redirect('/company/input02')
                } else {
                    res.redirect('/company/data')
                }
            })
            .catch(err => console.error(`Failed to find and update document: ${err}`))
    })
})

router.get('/input02', (req, res) => {
    res.render('companyInput02', { user: req.user })
})

router.post('/input02/:isFirst', (req, res) => {
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
            if (req.params.isFirst == "first") {
                res.redirect('/company/input03')
            } else {
                res.redirect('/company/data')
            }
        })
        .catch(err => console.error(`Failed to find and update document: ${err}`))
})

router.get('/input03', (req, res) => {
    res.render('companyInput03', { user: req.user })
})

router.post('/input03/:isFirst', (req, res) => {
    console.log(req.body)
    let update = {}
    update.tables = []
    let tables = req.body.tables
    if (tables <= 0) {
        tables = 1
    } else if (tables > 100) {
        tables = 100
    }
    let rNum
    if (req.params.isFirst == "first" || req.body.BothOrNot == "both") {
        rNum = Math.floor(Math.random() * 100000) + 10000
        update.randomNum = rNum
    } else {
        rNum = req.user.randomNum
    }
    for (let i = 0; i < tables; i++) {
        update.tables.push("https://superinfotime.herokuapp.com/user/start/" + req.user.id + "/" + i + "/" + rNum)
    }
    let update1 = { $set: update }
    Company.findOneAndUpdate({ _id: req.user.id }, update1, { new: true, useFindAndModify: false })
        .then(result => {
            if (req.params.isFirst == "first") {
                res.redirect('/company/input04')
            } else {
                res.redirect('/company/qrcode')
            }
        })
        .catch(err => console.error(`Failed to find and update document: ${err}`))
})

router.get('/input04', (req, res) => {
    res.render('companyInput04', { user: req.user })
})

router.post('/input04/:isFirst', (req, res, next) => {
    console.log(req.body)
    const form = formidable({
        uploadDir: "./uploads",
        keepExtensions: true
    })
    form.parse(req, (err, fields, files) => {
        if (err) {
            next(err);
            return;
        }
        let update = {}
        update.pdf = []
        if (files.uploadfile1.size != "") {
            let title = fields.fileTitle1
            if (title == "") title = "Menü"
            update.pdf.push({
                title,
                url: '/' + path.basename(files.uploadfile1.path)
            })
        }
        if (files.uploadfile2) {
            if (files.uploadfile2.size != "") {
                let title = fields.fileTitle2
                if (title == "") title = "Menü"
                update.pdf.push({
                    title,
                    url: '/' + path.basename(files.uploadfile2.path)
                })
            }
        }
        if (files.uploadfile3) {
            if (files.uploadfile3.size != "") {
                let title = fields.fileTitle3
                if (title == "") title = "Menü"
                update.pdf.push({
                    title,
                    url: '/' + path.basename(files.uploadfile3.path)
                })
            }
        }
        update.signUp = false
        console.log(update);
        let update1 = { $set: update }
        Company.findOneAndUpdate({ _id: req.user.id }, update1, { new: true, useFindAndModify: false })
            .then(result => {
                if (req.params.isFirst == "first") {
                    res.redirect('/company/inputlast')
                } else {
                    res.redirect('/company/data')
                }
            })
            .catch(err => console.error(`Failed to find and update document: ${err}`))
    })
})

router.get('/inputlast', (req, res) => {
    res.render('companyInputlast')
})

router.get('/qrcode', async (req, res) => {
    let urlList = []
    const result = await Company.find({ _id: req.user.id })
    const tables = result[0].tables
    for (let i = 0; i < tables.length; i++) {
        let url = await QRCode.toDataURL(tables[i])
        urlList.push(url)
    }
    res.render('companyqrCodes', { urlList })
})

router.get('/faq', (req, res) => {
    res.render('companyFaQ')
})

router.get('/settings', (req, res) => {
    res.render('companysettings', { user: req.user })
})

router.get('/data', (req, res) => {
    res.render('companyData', { user: req.user })
})

module.exports = router
