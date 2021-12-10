const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blogpost')
const bcrypt = require('bcrypt')
const User = require('../models/user')


const initialBlogs = [
  {
    "title": "I love coding",
    "author": "Jack White",
    "url": "www.google.com",
    "likes": 5,
    "user": "61ac34a05681056153ec3fc6"
  }, 
  {
    "title": "Coding is okay, but very time consuming",
    "author": "Martin Whisker",
    "url": "maps.google.com",
    "likes": 20,
    
  },

]

const initialUsers = [
    {
        username: 'marty',
        name: 'Martin Whisker',
        password: 'mmmWiskey'
    },
    {
        "username": "hellas",
        "name": "Mark Hellens",
        "password": "SpecialH"
    }
]

beforeEach(async () => {
    await Blog.deleteMany({})
    await User.deleteMany({})
    
    await initialBlogs.forEach( blog => new Blog(blog).save())

    const passwordHash = await bcrypt.hash('mmmWiskey', 10)
    const user = await new User({ username: 'marty', name: 'Martin Whisker' , passwordHash })

    await user.save()
    
    /*
    const passwordHash2 = await bcrypt.hash('SpecialH', 11)
    const user2 = await new User({ username: 'hellas', name: 'Mark Hellens' , passwordHash2 })

    await user2.save()
    */
    
})

describe('Return blog posts', () => {
    test('number of blog posts', async () => {

        const response = await api.get('/api/blogs')
        expect(response.body).toHaveLength(initialBlogs.length)
    })
})

describe('Confirm fields', () => {
    test('verify blog posts contain id field', async () => {

        const response = await api.get('/api/blogs')

        expect(response.body.every(blog => blog.id)).toBeDefined()
    })
})

describe('Post a new blog and verify properties', () => {

    test('Post a new blog and confirm in test database', async () => {

        
        const user = await api.post(`/api/login`)
            .send({ 
                username: "marty",
                password: "mmmWiskey"
            })
            .expect(200)
            .expect('Content-Type', /application\/json/)
        
        const token = user.body.token
        
        const newBlog = {
            "title": "I hate coding",
            "author": "Martin Whisker",
            "url": "maps.google.com",
            "likes": 1
        }
    
        await api.post(`/api/blogs`)
            .send(newBlog)
            .set('Authorization', `bearer ${token}`)
            .expect(200)
            .expect('Content-Type', /application\/json/)
    
        const response = await api.get('/api/blogs')
        const title = response.body.map(blog => blog.title)

        expect(response.body).toHaveLength(initialBlogs.length + 1)

        expect(title).toContain("I hate coding")
    })

    test('Post a new blog without token and confirm not in database', async () => {
      
        const newBlog = {
            "title": "I hate coding",
            "author": "Martin Whisker",
            "url": "maps.google.com",
            "likes": 1
        }
    
        await api.post(`/api/blogs`)
            .send(newBlog)
            .expect(401)
            .expect('Content-Type', /application\/json/)
    
        const response = await api.get('/api/blogs')
        const title = response.body.map(blog => blog.title)

        expect(response.body).toHaveLength(initialBlogs.length)
    })

    test('Verifies that blog without likes will get default value of 0', async () => {

        const user = await api.post(`/api/login`)
        .send({ 
            username: "marty",
            password: "mmmWiskey"
        })
        .expect(200)
        .expect('Content-Type', /application\/json/)
    
        const token = user.body.token

        const newBlogWithoutLikes = {
            "title": "This is a likes test",
            "author": "Willard Ronald",
            "url": "maps.google.com"
        }
    
        await api.post(`/api/blogs`)
            .send(newBlogWithoutLikes)
            .set('Authorization', `bearer ${token}`)
            .expect(200)
            .expect('Content-Type', /application\/json/)


        const response = await api.get('/api/blogs')
        const hasZeroLikes = response.body[response.body.length - 1].likes
        expect(hasZeroLikes).toBe(0)
    })

    test('Verifies that if the title and url properties are missing then Bad Request', async () => {

        const user = await api.post(`/api/login`)
        .send({ 
            username: "marty",
            password: "mmmWiskey"
        })
        .expect(200)
        .expect('Content-Type', /application\/json/)
    
        const token = user.body.token

        const newBlogWithoutURLandTitle = {
            "author": "Willard Ronald",
            "likes": 9
        }
    
        await api.post(`/api/blogs`)
            .send(newBlogWithoutURLandTitle)
            .set('Authorization', `bearer ${token}`)
            .expect(400)


        const response = await api.get('/api/blogs')
        
        expect(response.body).toHaveLength(initialBlogs.length)
    })
})

afterAll(() => {
  mongoose.connection.close()
})