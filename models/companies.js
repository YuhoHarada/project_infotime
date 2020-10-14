const mongoose = require('mongoose')

const Schema = mongoose.Schema

const companySchema = new Schema({
    googleId: String,
    firstName: String,
    lastName: String,
    emails: String,
    picture: String,
    signUp: Boolean,
    companyName: String,
    typeOfIndustry: String,
    address: Object,
    tables: Array,
    pdf: Array,
    customerData: Array
})

const companyGoogleSchema = mongoose.model('googleUser', companySchema)
module.exports = companyGoogleSchema
