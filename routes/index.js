const express = require('express')
const router = express.Router()
const { User } = require('../models')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')

dotenv.config()

router.get('/', (req, res) => {
    res.status(200).json({ success: true, message: 'Hello World' })
})

router.post('/login', async (req, res) => {
    const user = await User.findOne({
        where: {
            email: req.body.email
        }
    })
    if (!user) {
        res.status(400).json({ success: false, message: "There is no account with this email" })
        return
    }
    const isValid = await bcrypt.compare(req.body.password, user.password)
    if (!isValid) {
        res.status(401).json({ success: false, message: "The password you entered is incorrect" })
        return
    }
    const token = jwt.sign({ id: user.id, email: user.email, admin: user.admin }, process.env.SECRET_TOKEN, { expiresIn: '1h' })

    res.status(200).json({
        sucess: true,
        data: {
            userId: user.id,
            email: user.email,
            token: token
        }
    })
})

router.post('/signup', async (req, res) => {
    const { firstName, lastName, email, password } = req.body
    const hash = await bcrypt.hash(password, 12)

    const existingEmail = await User.findOne({
        where: {
            email: email
        }
    })

    const newUser = User.build({
        'firstName': firstName,
        'lastName': lastName,
        'email': email,
        'password': hash
    })

    try {
        if (existingEmail) {
            res.status(400).json({ success: false, message: "An account with this email already exists" })
            return
        } else if (!req.body) {
            res.status(400).json({ success: false, message: 'Please fill out all fields' })
        }
        await newUser.save()
        res.status(201).json({ success: true, user: newUser })
    }
    catch (err) {
        res.status(500).json({ success: false, message: 'Oops, somethings went wrong', error: err })
    }
})

module.exports = router
