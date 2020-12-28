const express = require('express')
const app = express()
require('./db/mongoose')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')
const path = require('path')
const publicDirPath = path.join(__dirname, '../public')

const port = process.env.PORT

app.use(express.json())
app.use(express.static(publicDirPath))
app.use(userRouter)
app.use(taskRouter)

app.get('', (req,res)=>{
    res.render('index', {})
})

app.get('/login', (req,res)=>{
    res.render('login',{})
})

app.get('/main', (req,res)=>{
    res.render('main', {
        
    })
})

app.listen(port, ()=>{
    console.log('Server is up on port ' + port)
})