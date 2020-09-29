const express = require('express')
const app = express()
const mongose = require("mongoose")
require('dotenv').config()
const passport = require('passport')
var cors = require('cors')
app.use(cors())
mongose.connect(process.env.MONGOURI, { useUnifiedTopology: true, useNewUrlParser: true }, (err) => {
    if (!err) {
        console.log("db connected successfully!!");
    }
})

app.use(express.json())
app.use("/user", require("./api/routes/user"))
app.use(passport.initialize())
app.use(passport.session())

const port = process.env.PORT || 2020

app.get('/', (req, res) => res.send('Hello World!'))
app.listen(port, () => console.log(`Example app listening on port ${port}`))