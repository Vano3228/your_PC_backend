const express = require('express')
const computersRouter = require('./routes/computers.routes.js')
const usersRouter = require('./routes/users.routes.ls')
const app = express()

const PORT = process.env.PORT || 5000

app.use(express.json())

app.use('/api', computersRouter)
app.use('/api', usersRouter)

app.listen(PORT, ()=>{
    console.log(`Server run on ${PORT} port`)
})
