const express = require('express')
const router = express.Router()
const { User } = require('../models')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')

dotenv.config()

router.post('/login', async (req, res) => {
    const user = await User.findOne({
        where: {
            email: req.body.email
        }
    })
    if (!user) {
        res.send('email does not exist')
        return
    }
    const isValid = await bcrypt.compare(req.body.password, user.password)
    if (!isValid) {
        res.send('incorrect password')
        return
    }
    const token = jwt.sign({ id: user.id, email: user.email }, process.env.SECRET_TOKEN, { expiresIn: '1h' })

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
            res.send('email already exists')
            return
        }
        await newUser.save()
        res.status(201).json(newUser)
    }
    catch (err) {
        res.status(503).json(err)
    }
})

module.exports = router
