const blogRouter = require('express').Router()
const Blog = require('../models/blogpost')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

blogRouter.get('/', (request, response) => {
    Blog
        .find({})
        .populate('user', { username: 1, name: 1, id: 1 })
        .then(blogs => {
            response.json(blogs)
        })

})

blogRouter.get('/:id', async (request, response) => {
    const blog = await Blog.findById(request.params.id)
    if (blog) {
      response.json(blog)
    } else {
      response.status(404).end()
    }
})

blogRouter.put('/:id', async (request, response) => {

  const body = request.body

  const blog = {
    likes: body.likes
  }

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true})
  response.json(updatedBlog)
})


blogRouter.post('/', async (request, response) => {
    const body = request.body
    const token = request.token
    const user = request.user

    if (!token || !user) {
      return response.status(401).json( { error: 'token missing or invalid' })
    }


    const blog = new Blog({
      url: body.url,
      title: body.title,
      author: body.author,
      user: user.id,
      likes: body.likes,
      id: body._id
    })

    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()
    
    response.json(savedBlog)
})


blogRouter.delete('/:id', async (request, response) => {

    const blog = await Blog.findById(request.params.id).populate('user', { username: 1, id:1 })
    const token = request.token
    const user = request.user 

    console.log(blog)

    if (!token || !user) {
      return response.status(401).json( { error: 'token missing or invalid' })
    }

    if ( !(blog.user._id.toString() === user._id.toString() )) {
      return response.status(401).json( { error: `Only ${blog.user.username} can delete this blog post` })
    }

    await Blog.findByIdAndRemove(request.params.id)

    user.blogs = user.blogs.filter(blog => blog._id.toString() !== request.params.id)
    await user.save()

    response.status(204).end()
  })

module.exports = blogRouter