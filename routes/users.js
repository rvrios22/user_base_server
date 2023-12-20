const express = require('express')
const router = express.Router()
const { User } = require('../models')

router.get('/', async (req, res) => {
    const users = await User.findAll()
    try {
        res.status(200).json(users)
    }
    catch(err) {
        res.send(err)
    }
})

module.exports = router