const express = require('express')
const router = express.Router()
const { User } = require('../models')
const bcrypt = require('bcrypt')

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
    const hash = await bcrypt.hash(password, 12)

    const newUser = User.build({
        'firstName': firstName,
        'lastName': lastName,
        'email': email,
        'password': hash
    })

    try {
        await newUser.save()
        res.status(201).json(newUser)
    }
    catch (err) {
        res.status(503).json(err)
    }
})

router.delete('/:id', async (req, res) => {
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
    const { firstName, lastName, email, password } = req.body
    try {
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
        })
        res.send(user)
    }
    catch (err) {

    }
})


module.exports = router