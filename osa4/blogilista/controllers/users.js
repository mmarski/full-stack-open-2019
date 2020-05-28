const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {

  const blogs = await User.find({})
  response.json(blogs)
})

usersRouter.post('/', async (request, response) => {
  console.log("posting user")
  const body = request.body

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(body.password, saltRounds)

  const user = new User({
    username: body.username,
    name: body.name,
    passwordHash,
  })

  const savedUser = await user.save()
  console.log("user saved")

  response.status(201).json(savedUser)
})

module.exports = usersRouter