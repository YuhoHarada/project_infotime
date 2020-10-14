const mongoose = require('mongoose')

const Schema = mongoose.Schema

const companySchema = new Schema({
    googleId: String,
    firstName: String,
    lastName: String,
    emails: String,
    picture: String,
    companyName: String
})

const companyGoogleSchema = mongoose.model('googleUser', companySchema)
module.exports = companyGoogleSchema