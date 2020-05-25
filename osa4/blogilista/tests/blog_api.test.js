const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')

const initialBlogs = [
  { _id: "5a422a851b54a676234d17f7", title: "React patterns", author: "Michael Chan", url: "https://reactpatterns.com/", likes: 7, __v: 0 }, { _id: "5a422aa71b54a676234d17f8", title: "Go To Statement Considered Harmful", author: "Edsger W. Dijkstra", url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html", likes: 5, __v: 0 }, { _id: "5a422b3a1b54a676234d17f9", title: "Canonical string reduction", author: "Edsger W. Dijkstra", url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html", likes: 12, __v: 0 }, { _id: "5a422b891b54a676234d17fa", title: "First class tests", author: "Robert C. Martin", url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll", likes: 10, __v: 0 }, { _id: "5a422ba71b54a676234d17fb", title: "TDD harms architecture", author: "Robert C. Martin", url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html", likes: 0, __v: 0 }, { _id: "5a422bc61b54a676234d17fc", title: "Type wars", author: "Robert C. Martin", url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html", likes: 2, __v: 0 }
]

// Reset database before each test
beforeEach(async () => {
  await Blog.deleteMany({})

  initialBlogs.forEach(async (element) => {
    let blogObj = new Blog(element)
    await blogObj.save()
  })
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
})

describe('blog posting', () => {

  test('is possible to the database', async () => {
    const testBlog = {
      title: "Testing",
      author: "The Tester",
      url: "test.fi",
      likes: 5
    }

    await api
      .post('/api/blogs')
      .send(testBlog)
      .expect(201)

    // Check that blog has been added
    const response = await api.get('/api/blogs').expect(200)
    expect(response.body).toHaveLength(initialBlogs.length + 1)
    const resBlogs = response.body.map(b => { delete b.id; return b })
    expect(resBlogs).toContainEqual(testBlog)
  })

  test('gives the field "likes" default value of 0', async () => {
    const testBlog = {
      title: "Testing",
      author: "The Tester",
      url: "test.fi",
    }

    await api
      .post('/api/blogs')
      .send(testBlog)
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
    }
    const testBlog2 = {
      title: "Testing",
      author: "The Tester",
    }

    await api
      .post('/api/blogs')
      .send(testBlog)
      .expect(400)

    await api
      .post('/api/blogs')
      .send(testBlog2)
      .expect(400)
  })
})

// TODO database contains the right amount of blogs
// Tee ensin .then llä ja sitten async awaittiin
// Liitä automaattisen try catchauksen kirjasto

afterAll(() => {
  mongoose.connection.close()
})