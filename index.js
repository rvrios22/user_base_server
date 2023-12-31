const express = require('express')
const app = express()
const cors = require('cors')
const port = 8080;
const users = require('./routes/users')
const index = require('./routes/index')
const models = require('./models')


app.use(express.json())
app.use(cors())
app.use('/users', users)
app.use('/', index)

models.sequelize.sync({ alter: false, force: false }).then(() => {
    console.log('db synched')
})

app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})