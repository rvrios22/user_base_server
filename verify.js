const jwt = require('jsonwebtoken')

const verifyToken = (token) => {
    if (!token) {
        return
    }
    
    const decodedToken = jwt.verify(token, process.env.SECRET_TOKEN)
    console.log('here')
    res.status(200).json({ success: true, data: { userId: decodedToken.userId, email: decodedToken.email } })
}

module.exports = verifyToken