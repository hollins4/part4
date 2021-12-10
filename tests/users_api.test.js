const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blogpost')
const bcrypt = require('bcrypt')
const User = require('../models/user')

const usersInDb = async () => {
    const users = await User.find({})
    return users.map(u => u.toJSON())
}

describe('when there is initially one user in db', () => {
    beforeEach(async () => {
      await User.deleteMany({})
  
      const passwordHash = await bcrypt.hash('sekret', 10)
      const user = new User({ username: 'root', passwordHash })
  
      await user.save()
    })
  
    test('creation succeeds with a fresh username', async () => {
      const usersAtStart = await usersInDb()
  
      const newUser = {
        username: 'mluukkai',
        name: 'Matti Luukkainen',
        password: 'salainen',
      }
  
      await api
        .post('/api/users')
        .send(newUser)
        .expect(200)
        .expect('Content-Type', /application\/json/)
  
      const usersAtEnd = await usersInDb()
      expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)
  
      const usernames = usersAtEnd.map(u => u.username)
      expect(usernames).toContain(newUser.username)
    })

    test('creation fails with short username', async () => {
        const usersAtStart = await usersInDb()

        const newUserWithShortUsername = {
            username: 'ba',
            name: 'Bad Username',
            password: 'FirstOrder',
        }

        await api
            .post('/api/users')
            .send(newUserWithShortUsername)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })

    test('creation fails with short password', async () => {
        const usersAtStart = await usersInDb()

        const newUserWithShortPassword = {
            username: 'badpass',
            name: 'Bad Password',
            password: 'S',
        }

        await api
            .post('/api/users')
            .send(newUserWithShortPassword)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })
  })
  
afterAll(() => {
    mongoose.connection.close()
})