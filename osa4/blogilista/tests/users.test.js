const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const bcrypt = require('bcryptjs')
const User = require('../models/user')
const Blog = require('../models/blog')


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

  test('password requirement and length of at least 3 characters is enforced', async () => {
    const newUser = {
      username: 'test',
      name: 'The Tester',
      password: 'te'
    }
    const newUser2 = {
      username: 'test',
      name: 'The Tester'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)
    expect(result.body.error).toContain('password must be at least 3 characters long')

    const result2 = await api
      .post('/api/users')
      .send(newUser2)
      .expect(400)
      .expect('Content-Type', /application\/json/)
    expect(result2.body.error).toContain('password must be at least 3 characters long')

    const res = await api.get('/api/users')
    expect(res.body).toHaveLength(0)
  })

  test('username requirement, uniqueness and length of at least 3 characters is enforced', async () => {
    const newUser = {
      username: 'te',
      name: 'The Tester',
      password: 'testpassword'
    }
    const newUser2 = {
      name: 'The Tester',
      password: 'testpassword'
    }
    const newUser3 = {
      username: 'test',
      name: 'The Tester',
      password: 'testpassword'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)
    expect(result.body.error).toContain('shorter than the minimum allowed length')

    const result2 = await api
      .post('/api/users')
      .send(newUser2)
      .expect(400)
      .expect('Content-Type', /application\/json/)
    expect(result2.body.error).toContain('`username` is required')

    const res = await api.get('/api/users')
    expect(res.body).toHaveLength(0)

    await api
      .post('/api/users')
      .send(newUser3)
      .expect(201)
    const result3 = await api
      .post('/api/users')
      .send(newUser3)
      .expect(400)
      .expect('Content-Type', /application\/json/)
    expect(result3.body.error).toContain('expected `username` to be unique')

    const res2 = await api.get('/api/users')
    expect(res2.body).toHaveLength(1)
  })
})

describe('when there is one user in the database', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', name: 'ruutti', passwordHash })

    await user.save()
  })

  test('the user password has been encrypted correctly', async () => {
    const users = await User.find({})

    expect(bcrypt.compareSync('sekret', users[0].passwordHash)).toBe(true) // Same as in beforeEach
  })

  test('it is possible to get the user list as array', async () => {
    const res = await api.get('/api/users')
    expect(res.body).toHaveLength(1)
    expect(res.body instanceof Array).toBe(true)
    expect(res.body[0].username).toEqual('root')
  })

  test('login is possible and returns token, username and name', async () => {
    // 4.18
    const loginInfo = {
      username: 'root',
      password: 'sekret'
    }
    const response = await api
      .post('/api/login')
      .send(loginInfo)
      .expect(200)

    const body = response.body
    expect(body.token).toBeDefined()
    expect(body.username).toBeDefined()
    expect(body.name).toBeDefined()
    expect(typeof body.token === 'string').toBe(true)
    expect(typeof body.username === 'string').toBe(true)
  })
})

describe('when there are multiple users with blogs', () => {
  beforeEach(async () => {
    await User.deleteMany({})
    await Blog.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const pekka = new User({ username: 'pekka', passwordHash })
    const jarmo = new User({ username: 'jarmo', passwordHash })
    await pekka.save()
    await jarmo.save()

    const pekkaBlog = new Blog({ user: pekka._id, _id: "5a422a851b54a676234d17f7", title: "React patterns", author: "Michael Chan", url: "https://reactpatterns.com/", likes: 7, __v: 0 })
    const jarmoBlog = new Blog({ user: jarmo._id, _id: "5a422aa71b54a676234d17f8", title: "Go To Statement Considered Harmful", author: "Edsger W. Dijkstra", url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html", likes: 5, __v: 0 })
    await pekkaBlog.save()
    await jarmoBlog.save()
    pekka.blogs = pekka.blogs.concat(pekkaBlog._id)
    jarmo.blogs = jarmo.blogs.concat(jarmoBlog._id)
    await pekka.save()
    await jarmo.save()
  })

  test('users contain the blogs they have added, in correct format', async () => {
    const res = await api.get('/api/users')
    res.body.forEach(element => {
      expect(element.blogs).toBeDefined()
      expect(element.blogs instanceof Array).toBe(true)
      expect(element.blogs).toHaveLength(1)
      expect(element.blogs[0].title).toBeDefined()
      expect(element.blogs[0].url).toBeDefined()
      expect(element.blogs[0].author).toBeDefined()
      expect(element.blogs[0].id).toBeDefined()
    })
  })
})


afterAll(() => {
  mongoose.connection.close()
})