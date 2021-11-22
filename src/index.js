const express = require('express')
const path = require('path')
require('dotenv').config()

const app = express()

app.use(express.urlencoded({extended: false}))
app.use(express.json())
app.use(require('./routes/routes.js'))
app.use(express.static(path.join(__dirname, 'public')))

PORT = process.env.PORT

app.listen(PORT, () => {

    console.log('Server running on port: ' + PORT)
})