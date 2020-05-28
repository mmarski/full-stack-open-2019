const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({}).populate('user', { username: 1, name: 1 })

  response.json(blogs)
})

blogsRouter.get('/:id', async (request, response) => {

  const blog = await Blog.findById(request.params.id)
  response.json(blog)
})

blogsRouter.post('/', async (request, response) => {
  const body = request.body

  const user = await User.findById(body.userId)

  if (!user) {
    response.status(400).send({ error: 'user required for blog post' })
  }
  else {
    const blog = new Blog({
      title: body.title,
      url: body.url,
      author: body.author,
      likes: body.likes,
      user: user._id
    })

    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()
    response.status(201).json(savedBlog)
  }
})

blogsRouter.delete('/:id', async (request, response) => {

  const deleted = await Blog.findByIdAndRemove(request.params.id)

  if(deleted) {
    response.status(204).end()
  } else {
    response.status(404).end()
  }
})

blogsRouter.put('/:id', async (request, response) => {
  const body = request.body

  const blog = {
    likes: body.likes
  }

  const updated = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })

  if(updated) {
    response.json(updated)
  } else {
    response.status(404).end()
  }
})

module.exports = blogsRouter