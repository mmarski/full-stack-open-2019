const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')
const bcrypt = require('bcryptjs')

const initialBlogs = [
  { _id: "5a422a851b54a676234d17f7", title: "React patterns", author: "Michael Chan", url: "https://reactpatterns.com/", likes: 7, __v: 0 }, { _id: "5a422aa71b54a676234d17f8", title: "Go To Statement Considered Harmful", author: "Edsger W. Dijkstra", url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html", likes: 5, __v: 0 }, { _id: "5a422b3a1b54a676234d17f9", title: "Canonical string reduction", author: "Edsger W. Dijkstra", url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html", likes: 12, __v: 0 }, { _id: "5a422b891b54a676234d17fa", title: "First class tests", author: "Robert C. Martin", url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll", likes: 10, __v: 0 }, { _id: "5a422ba71b54a676234d17fb", title: "TDD harms architecture", author: "Robert C. Martin", url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html", likes: 0, __v: 0 }, { _id: "5a422bc61b54a676234d17fc", title: "Type wars", author: "Robert C. Martin", url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html", likes: 2, __v: 0 }
]
let testUserId = undefined
let testUserToken = undefined

// Create user once
beforeAll(async () => {
  await User.deleteMany({})

  const username = 'test'
  const password = 'testpassword'
  const passwordHash = await bcrypt.hash(password, 10)
  const user = new User({ username: username, name: 'The Tester', passwordHash: passwordHash })
  await user.save()
  const response = await api.post('/api/login').send({ username, password })

  testUserId = user._id
  testUserToken = response.body.token
  initialBlogs.forEach(b => b.user = testUserId)
})

// Reset database before each test
beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(initialBlogs)
  // v Mieluummin normi forlooppi tähän, koska tossa käynnistyy joka kerta uus async "instanssi"
  /*initialBlogs.forEach(async (element) => {
    let blogObj = new Blog(element)
    await blogObj.save()
  })*/
})

describe('blog database', () => {

  test('returns blogs as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('has the right amount of blogs', async () => {
    const res = await api.get('/api/blogs')
    expect(res.body).toHaveLength(initialBlogs.length)
  })

  test('json format contains the field "id"', async () => {
    const res = await api.get('/api/blogs')
    res.body.forEach(element => {
      expect(element.id).toBeDefined()
    })
  })

  test('contains the users that have added the blogs, in correct format', async () => {
    const res = await api.get('/api/blogs')
    res.body.forEach(element => {
      expect(element.user).toBeDefined()
      expect(element.user instanceof Object).toBe(true)
      expect(element.user.username).toBeDefined()
      expect(element.user.name).toBeDefined()
      expect(element.user.id).toBeDefined()
    })
  })
})

describe('blog posting', () => {

  test('is possible to the database', async () => {
    const testBlog = {
      title: "Testing",
      author: "The Tester",
      url: "test.fi",
      likes: 5,
      userId: testUserId
    }

    await api
      .post('/api/blogs')
      .send(testBlog)
      .set('Authorization', 'bearer ' + testUserToken)
      .expect(201)

    // Check that blog has been added
    const response = await api.get('/api/blogs').expect(200)
    expect(response.body).toHaveLength(initialBlogs.length + 1)
    const resBlogs = response.body.map(b => { delete b.id; delete b.user; return b })
    delete testBlog.userId
    expect(resBlogs).toContainEqual(testBlog)
  })

  test('gives the field "likes" default value of 0', async () => {
    const testBlog = {
      title: "Testing",
      author: "The Tester",
      url: "test.fi",
      userId: testUserId
    }

    await api
      .post('/api/blogs')
      .send(testBlog)
      .set('Authorization', 'bearer ' + testUserToken)
      .expect(201)

    // Check that blog has been set likes: 0
    const response = await api.get('/api/blogs').expect(200)
    const postedBlog = response.body.find(element => element.title === 'Testing')
    expect(postedBlog.likes).toEqual(0)
  })

  test('requires blog title and url', async () => {
    const testBlog = {
      author: "The Tester",
      url: "test.fi",
      userId: testUserId
    }
    const testBlog2 = {
      title: "Testing",
      author: "The Tester",
      userId: testUserId
    }

    const result = await api
      .post('/api/blogs')
      .send(testBlog)
      .set('Authorization', 'bearer ' + testUserToken)
      .expect(400)
      .expect('Content-Type', /application\/json/)
    expect(result.body.error).toContain('`title` is required')

    const result2 = await api
      .post('/api/blogs')
      .send(testBlog2)
      .set('Authorization', 'bearer ' + testUserToken)
      .expect(400)
      .expect('Content-Type', /application\/json/)
    expect(result2.body.error).toContain('`url` is required')
  })
})

describe('blog deletion', () => {

  test('succeeds with valid id', async () => {
    const res = await api.get('/api/blogs').expect(200)
    const firstBlogId = res.body[0].id

    await api.delete('/api/blogs/' + firstBlogId).expect(204)
  })

  test('fails with 404 or 400 using invalid id', async () => {
    const result = await api
      .delete('/api/blogs/invalidid')
      .expect(400)
      .expect('Content-Type', /application\/json/)
    expect(result.body.error).toContain('malformed id')

    await api
      .delete('/api/blogs/aaaaaaaaaaaaaaaaaaaaaaaa')
      .expect(404)
  })
})

describe('blog modification', () => {

  test('for likes succeeds with valid id', async () => {
    const testBlog = {
      title: "Testing",
      author: "The Tester",
      url: "test.fi",
      likes: 1,
      userId: testUserId
    }
    const modifiedTestBlog = {
      likes: 10
    }

    const posted = await api
      .post('/api/blogs/')
      .send(testBlog)
      .set('Authorization', 'bearer ' + testUserToken)
      .expect(201)
    expect(posted.body.likes).toEqual(1)

    const modified = await api.put('/api/blogs/' + posted.body.id).send(modifiedTestBlog).expect(200)
    expect(modified.body.likes).toEqual(10)
  })

  test('fails with 404 or 400 using invalid id', async () => {
    const result = await api
      .put('/api/blogs/invalidid')
      .send({})
      .expect(400)
      .expect('Content-Type', /application\/json/)
    expect(result.body.error).toContain('malformed id')

    await api.put('/api/blogs/aaaaaaaaaaaaaaaaaaaaaaaa').send({}).expect(404)
  })
})


afterAll(() => {
  mongoose.connection.close()
})