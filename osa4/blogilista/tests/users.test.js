const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const bcrypt = require('bcryptjs')
const User = require('../models/user')


describe('when user database is empty', () => {
  beforeEach(async () => {
    await User.deleteMany({})
  })

  test('user creation is possible', async () => {

    const newUser = {
      username: 'test',
      name: 'The Tester',
      password: 'testpassword'
    }

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

  test('the user password has been encrypted correctly', async () => {
    const users = await User.find({})

    expect(bcrypt.compareSync('sekret', users[0].passwordHash)).toBe(true) // Same as in beforeEach
  })

  test('it is possible to get the user list', async () => {
    const res = await api.get('/api/users')
    expect(res.body).toHaveLength(1)
    expect(res.body[0].username).toEqual('root')
  })
})


afterAll(() => {
  mongoose.connection.close()
})