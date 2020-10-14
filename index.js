require('dotenv').config()
const express = require('express');
const app = express()
//const QRCode = require('qrcode')

// const mongoose = require('mongoose');

// mongoose.connect(process.env.dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
//     .then(() => {
//         console.log('connected to db')
//     })

app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.set('view engine', 'ejs')

app.get('/', (req, res) => {
    res.render('index')
})

app.get('/company/input01', (req, res) => {
    res.render('companyInput01')
})

app.post('/company/input01', (req, res) => {
    console.log(req.body);
    res.redirect('/company/input01')
})

// app.get('/qrcode', async (req, res) => {
//     let urlList = []
//     for (let i = 0; i < 4; i++) {
//         let url = await QRCode.toDataURL(`http://localhost:3000/test/${i}`)
//         urlList.push(url)
//     }
//     console.log(urlList);
//     res.render('index', { urlList })
// })

app.listen(process.env.PORT || 3000, () => {
    console.log('server listening at 3000')
})
