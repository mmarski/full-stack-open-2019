const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const bcrypt = require('bcrypt')
const User = require('../models/user')


describe('when user database is empty', () => {
  beforeEach(async () => {
    await User.deleteMany({})
  })

  test('user creation is possible', async () => {
    console.log("runninr test")
    const newUser = {
      username: 'test',
      name: 'The Tester',
      password: 'testpassword'
    }

    console.log("awaiting post")
    await api.post('/api/users').send(newUser).expect(201)
  })
})

describe('when there is one user in the database', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })
})


afterAll(() => {
  mongoose.connection.close()
})