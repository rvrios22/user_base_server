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
    const decodedToken = jwt.verify(token, process.env.SECRET_TOKEN)
    if (!decodedToken.admin) {
        res.status(403).json({ success: false, message: "You do not have access" })
        return
    }
    try {
        const users = await User.findAll()
        res.status(200).json(users)
    }
    catch (err) {
        res.status(401).json({ success: false, message: "Oops, something went wrong" })
        return
    }
})

router.get('/:id', async (req, res) => {
    const auth = req.headers.authorization
    if (!auth) {
        res.status(401).json({ success: false, message: "Unauthorized access" })
    }
    const token = auth.split(' ')[1]
    const decodedToken = jwt.verify(token, process.env.SECRET_TOKEN)
    if (!decodedToken.admin) {
        res.status(403).json({ success: false, message: "You do not have access" })
        return
    }
    try {
        const user = await User.findOne({
            where: {
                id: req.params.id
            }
        })
        if (!user) {
            res.send('User does not exist')
        } else {
            res.status(200).json(user)
        }
    }
    catch (err) {
        res.status(503).json(err)
    }
})


router.delete('/:id', async (req, res) => {
    const auth = req.headers.authorization
    if (!auth) {
        res.status(403).json({ success: false, message: 'Unauthorized access' })
        return
    }
    const token = auth.split(' ')[1]
    const decodedToken = jwt.verify(token, process.env.SECRET_TOKEN)
    if (!decodedToken.admin) {
        res.status(403).json({ success: false, message: "You do not have access" })
        return
    }
    try {
        const user = await User.findOne({
            where: {
                id: req.params.id
            }
        })
        if (!user) {
            res.send('user does not exist')
        } else {
            await user.destroy();
            res.status(203).json({ message: 'user deleted ' })
        }
    }
    catch (err) {
        res.send(err)
    }
})

router.put('/:id', async (req, res) => {
    const { firstName, lastName, email, password, admin } = req.body
    const auth = req.headers.authorization
    if (!auth) {
        res.status(403).json({ success: false, message: 'Unauthorized access' })
        return
    }
    const token = auth.split(' ')[1]
    try {
        jwt.verify(token, process.env.SECRET_TOKEN)
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
        res.status(203).json({ success: true, user })
    }
    catch (err) {
        res.status(403).json({ success: false, message: 'Unauthorized access' })
    }
})


module.exports = router