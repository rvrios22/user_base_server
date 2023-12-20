const express = require('express')
const app = express()
const port = 8080;
const users = require('./routes/users')

app.use(express.json())
app.use('/users', users)

app.get('/', (req, res) => {
    res.send("Hello World")
})

app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})