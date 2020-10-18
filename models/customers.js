const mongoose = require('mongoose')

const Schema = mongoose.Schema

const customerSchema = new Schema({
    companyId: String,
    table: Number,
    stayFrom: Date,
    stayFromStr: String,
    stayTo: Date,
    stayToStr: String,
    userName: String,
    userStreet: String,
    userCode: String,
    userCity: String,
    userPhone: String
}, { timestamps: true })

const customersSchema = mongoose.model('customer', customerSchema)
module.exports = customersSchema
