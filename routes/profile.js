const express = require('express')
const router = express.Router()
const { User } = require('../models')
const jwt = require('jsonwebtoken')

router.get('/', async (req, res) => {
    const auth = req.headers.authorization
    if (!auth) {
        res.status(401).json({ sucess: false, message: "unauthroized access" })
        return
    }
    const token = auth.split(' ')[1]
    try {
        const decodedToken = jwt.verify(token, process.env.SECRET_TOKEN)
        const user = await User.findByPk(decodedToken.id)
        res.status(200).json({ sucess: true, name: `${user.firstName} ${user.lastName}`, email: user.email, admin: user.admin })
    }
    catch (err) {
        res.status(403).json({ sucess: false, message: "Oops, something went wrong" })
    }
})

module.exports = router