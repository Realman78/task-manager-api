const express = require('express')
const router = new express.Router
const auth = require('../middleware/auth')
const Task = require('../models/task')
const multer = require('multer')
const sharp = require('sharp')


router.post('/tasks', auth, async (req, res)=>{
    const task = new Task({
        ...req.body,
        owner: req.user._id
    })

    try{
        await task.save()
        res.status(201).send(task)
    }catch(e){
        res.status(500).send()
    }
})



router.get('/tasks', auth, async (req,res)=>{
    try{
        // const tasks = await Task.find({owner: req.user._id})
        // res.send(tasks) ili
        const match = {}
        const sort = {}

        if (req.query.completed){
            match.completed = req.query.completed === 'true'
        }

        if (req.query.sortBy){
            const parts = req.query.sortBy.split('_')
            sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
            console.log(sort)
        }

        await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate()
        res.send(req.user.tasks)
    }catch(e){
        res.status(500).send()
    }
})

router.get('/tasks/:id', auth,  async (req,res)=>{
    const _id = req.params.id
    try{
        const task = await Task.findOne({_id, owner: req.user._id})
        if (!task) return res.status(404).send()
        res.send(task)
    }catch(e){
        res.status(500).send()
    }
})

router.patch('/tasks/:id', auth, async (req,res)=>{
    const updates = Object.keys(req.body)
    const updateables = ['completed', 'description']
    const isValidOperation = updates.every((update)=> updateables.includes(update))
    if (!isValidOperation){
        res.status(400).send({error: 'invalid update(s)'})
    }
    try{
        const task = await Task.findOne({_id: req.params.id, owner: req.user._id})
        if (!task){return res.status(404).send()}
        updates.forEach((update2)=>task[update2] = req.body[update2])
        await task.save()
        res.send(task)
    }catch(e){
        res.status(400).send(e)
    }
})

router.delete('/tasks/:id', auth, async (req, res)=>{
    try{
        const task = await Task.findOneAndDelete({_id: req.params.id, owner: req.user._id})
        if (!task){ return res.status(404).send()}
        res.send(task)
    }catch(e){
        res.status(500).send()
    }
})

const upload = multer({
    limits:{
        fileSize:1e6
    },
    fileFilter(req,file,cb){
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return cb(new Error('The file must be jpg,jpeg or png'))
        }
        cb(undefined,true)
    }
})

router.post('/tasks/:id/taskPicture', auth, upload.single('taskPicture'), async (req,res)=>{
    const task = await Task.findById(req.params.id)
    if (!task){
        return res.status(404).send()
    }
    const buffer = await sharp(req.file.buffer).resize({width: 250, height:250}).png().toBuffer()
    task.taskPicture = buffer
    await task.save()
    res.send()
}, (error,req,res,next)=>{
    res.status(400).send({error: error.message})
})

router.get('/tasks/:id/taskPicture', auth, async (req,res)=>{
    try{
        const task = await Task.findById(req.params.id)
        if (!task){
            return res.status(404).send()
        }
        res.set('Content-Type', 'image/png')
        res.send(task.taskPicture)
    }catch(e){
        res.status(500).send(e)
    }
    
})

module.exports = router