const express = require('express')
const router = express.Router()
const Company = require('./../models/companies')

router.get('/start/:companyID/:tableID', (req, res) => {
    res.render('userAnmeldung', { companyID: req.params.companyID, tableID: req.params.tableID })
})

router.get('/userInfo/:companyID/:tableID', (req, res) => {
    res.render('userInfo', { companyID: req.params.companyID, tableID: req.params.tableID })
})

router.post('/userInfo/:companyID/:tableID', async (req, res) => {
    const result = await Company.find({ _id: req.params.companyID })
    let update = result[0]
    let customerArray = result[0].customerData
    const userData = {
        userName: req.body.name,
        userStreet: req.body.street,
        userCity: req.body.city,
        userPhone: req.body.phone,
        stayFrom: new Date()
        // stayTo: new Date() 
    }
    customerArray.push(userData)
    console.log(customerArray);
    update.customerData = customerArray
    let updateone = { $set: update }
    const result2 = await Company.findOneAndUpdate({ _id: req.params.companyID }, updateone, { new: true, useFindAndModify: false })
    // .then(result => {
    //     
    console.log(result2.customerData);
    res.status(201).redirect(`/user/userInfo/${req.params.companyID}/${req.params.tableID}`)
    console.log("I am saved")
    // })
    // .catch(err => console.log(err))
})


router.get(`/user/userInfo/${req.params.companyID}/${req.params.tableID}`, (req, res) => {
    res.render('companyInfo')
})

module.exports = router
