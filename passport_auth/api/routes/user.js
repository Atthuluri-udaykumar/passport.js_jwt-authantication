const router = require("express").Router()
const { signInValidaton, signUpValidaton } = require("../helper/validation")
const User = require("../model/user")
const JWT = require("jsonwebtoken")
const bcrypt = require('bcryptjs');

const passport = require("passport")
const configPassport = require("../passport")

router.get("/", passport.authenticate("jwt", { session: false }), (req, res) => {
    res.send("this is auth route")
})

router.post("/signup", async (req, res) => {
    const { error } = signUpValidaton(req.body);
    if (error) return res.json({
        status: 400,
        msg: error.details[0].message
    })

    const { email, password } = req.body

    const findUser = await User.findOne({ email: email })
    if (findUser) return res.json({
        status: 400,
        msg: "email already exist"
    })

    // paassword hashing usong bcsript:-
    const salt = await bcrypt.genSaltSync(10);
    const hash = await bcrypt.hashSync(password, salt);

    const newUser = new User({ email, password: hash })
    await newUser.save().then(() => {
        res.json({ status: 200, msg: "user data saved" })

    }).catch(() => res.json({ status: 400, msg: "data missmached" }))
})

router.post("/signin", async (req, res) => {
    const { error } = signInValidaton(req.body);
    if (error) return res.json({
        status: 400,
        msg: error.details[0].message
    })

    const { email, password } = req.body

    const findUser = await User.findOne({ email: email })
    if (!findUser) return res.json({
        status: 400,
        msg: "email or password not mached"
    })

    const mached = await bcrypt.compareSync(password, findUser.password)
    if (!mached) {
        res.json({
            status: 400,
            error: "invalid email or password"
        })
    }
    else {
        const token = JWT.sign(
            {
                iss: process.env.SECRET_KEY,
                sub: findUser.id,
                iat: new Date().getTime(),
                exp: new Date().setDate(new Date().getDate() + 1)
            }, process.env.SECRET_KEY);

        res.json({
            status: 200,
            token: token
        })
    }

})


module.exports = router