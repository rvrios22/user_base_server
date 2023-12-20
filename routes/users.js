const express = require('express')
const router = express.Router()
const { User } = require('../models')

router.get('/', async (req, res) => {
    const users = await User.findAll()
    try {
        res.status(200).json(users)
    }
    catch (err) {
        res.send(err)
    }
})

router.get('/:id', async (req, res) => {
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

router.post('/', async (req, res) => {
    const { firstName, lastName, email, password } = req.body

    const newUser = User.build({
        'firstName': firstName,
        'lastName': lastName,
        'email': email,
        'password': password
    })

    try {
        await newUser.save()
        res.status(201).json(newUser)
    }
    catch (err) {
        res.status(503).json(err)
    }
})

module.exports = router