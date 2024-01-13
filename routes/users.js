const express = require('express')
const router = express.Router()
const { User } = require('../models')
const jwt = require('jsonwebtoken')



router.get('/', async (req, res) => {
    const auth = req.headers.authorization
    if (!auth) {
        res.status(401).json({ success: false, message: 'unauthorized access' })
        return
    }
    const token = auth.split(' ')[1]
    try {
        const decodedToken = jwt.verify(token, process.env.SECRET_TOKEN)
        if (!decodedToken.admin) {
            res.status(403).json({ success: false, message: "You do not have access" })
            return
        }
        const users = await User.findAll()
        res.status(200).json({ success: true, users: users })
    }
    catch (err) {
        res.status(500).json({ success: false, message: "Oops, something went wrong", error: err })
        return
    }
})

router.get('/:id', async (req, res) => {
    const auth = req.headers.authorization
    if (!auth) {
        res.status(401).json({ success: false, message: "Unauthorized access" })
        return
    }
    const token = auth.split(' ')[1]
    try {
        const decodedToken = jwt.verify(token, process.env.SECRET_TOKEN)
        console.log('here')
        if (!decodedToken.admin) {
            res.status(403).json({ success: false, message: "You do not have access" })
            return
        }
        const user = await User.findOne({
            where: {
                id: req.params.id
            }
        })
        if (!user) {
            res.status(404).json({ success: false, message: "User does not exist" })
        } else {
            res.status(200).json({ success: true, user: user })
        }
    }
    catch (err) {
        res.status(500).json({ success: false, message: "Oops, something went wrong", error: err })
        return
    }
})


router.delete('/:id', async (req, res) => {
    const auth = req.headers.authorization
    if (!auth) {
        res.status(401).json({ success: false, message: 'Unauthorized access' })
        return
    }
    const token = auth.split(' ')[1]
    try {
        const decodedToken = jwt.verify(token, process.env.SECRET_TOKEN)
        if (!decodedToken.admin) {
            res.status(403).json({ success: false, message: "You do not have access" })
            return
        }
        const user = await User.findOne({
            where: {
                id: req.params.id
            }
        })
        if (!user) {
            res.status(404).json({ success: false, message: "User does not exist" })
        } else {
            await user.destroy();
            res.status(203).json({ success: true, message: 'user deleted ', user: user })
        }
    }
    catch (err) {
        res.status(500).json({ success: false, message: "Oops, something went wrong", error: err })
        return
    }
})

router.put('/:id', async (req, res) => {
    const { firstName, lastName, email, password, admin } = req.body
    const auth = req.headers.authorization
    if (!auth) {
        res.status(401).json({ success: false, message: 'Unauthorized access' })
        return
    }
    const token = auth.split(' ')[1]
    try {
        const decodedToken = jwt.verify(token, process.env.SECRET_TOKEN)
        if (!decodedToken.admin) {
            res.status(403).json({ success: false, message: "You do not have access" })
            return
        }
        const user = await User.findOne({
            where: {
                id: req.params.id
            }
        })

        user.update({
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: password,
            admin: admin
        })
        res.status(203).json({ success: true, user: user })
    }
    catch (err) {
        res.status(500).json({ success: false, message: 'Oops, something went wrong', error: err })
    }
})


module.exports = router