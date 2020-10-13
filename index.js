require('dotenv').config()
const express = require('express');
const app = express()
// const mongoose = require('mongoose');

// mongoose.connect(process.env.dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
//     .then(() => {
//         console.log('connected to db')
//     })

app.use(express.static('public'))
app.use(express.json())
app.set('view engine', 'ejs')

app.get('/', (req, res) => {
    res.render('index')
})

app.listen(process.env.PORT||3000, () => {
    console.log('server listening at 3000')
})

