const bcrypt = require('bcryptjs')
const usersRouter = require('express').Router()
//const jwt = require('jsonwebtoken')
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
  const users = await User
    .find({}).populate('blogs', { url: 1, title: 1, author: 1 })

  response.json(users)
})

usersRouter.post('/', async (request, response) => {
  const body = request.body

  // Password must be at least 3 characters long
  if (!body.password || body.password.length < 3) {
    response.status(400).send({ error: 'password must be at least 3 characters long' })
  }
  else {
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(body.password, saltRounds)

    const user = new User({
      username: body.username,
      name: body.name,
      passwordHash,
    })

    const savedUser = await user.save()

    response.status(201).json(savedUser)
  }
})

module.exports = usersRouter