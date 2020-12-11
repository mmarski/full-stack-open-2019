import React, { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import CreateBlogForm from './components/CreateBlogForm'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [errorMessage, setErrorMessage] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      console.log('Got logged in user', loggedUserJSON)
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    console.log('logging in with', username, password)
    try {
      const user = await loginService.login({
        username, password,
      })

      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      setSuccessMessage('Logged in successfully')
      setTimeout(() => {
        setSuccessMessage(null)
      }, 5000)
    }

    catch (exception) {
      setErrorMessage('Invalid username or password')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleLogout = () => {
    setUser(null)
    window.localStorage.clear()
  }

  const blogFormRef = useRef()
  const createBlog = async (blogObject) => {
    try {
      const blog = await blogService.create(blogObject)
      setBlogs(blogs.concat(blog))
      blogFormRef.current.toggleVisibility()
      setSuccessMessage('Created new blog ' + blog.title + ' by ' + blog.author)
      setTimeout(() => {
        setSuccessMessage(null)
      }, 5000)
    }
    catch (exception) {
      setErrorMessage('Blog creation failed. ' + exception.response.data.error)
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleBlogLike = async (id, blogObject) => {
    try {
      const blog = await blogService.update(id, blogObject)
      setBlogs(blogs.map(b => b.id !== id ? b : blog))
      setSuccessMessage('Liked blog ' + blog.title + '!')
      setTimeout(() => {
        setSuccessMessage(null)
      }, 5000)
    }
    catch (exception) {
      setErrorMessage('Failed to like blog. ' + exception.response.data.error)
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleRemoveBlog = async (id) => {
    const blog = blogs.find(b => b.id === id)
    if (window.confirm('Really delete blog ' + blog.title + '?') === true) {
      try {
        await blogService.remove(id)
        setBlogs(blogs.filter(b => b.id !== id))
        setSuccessMessage('Removed blog ' + blog.title)
        setTimeout(() => {
          setSuccessMessage(null)
        }, 5000)
      }
      catch (exception) {
        setErrorMessage('Failed to remove blog. ' + exception.response.data.error)
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
      }
    }
  }

  const loginForm = () => (
    <div>
      <LoginForm
        username={username}
        password={password}
        handleUsernameChange={({ target }) => setUsername(target.value)}
        handlePasswordChange={({ target }) => setPassword(target.value)}
        handleSubmit={handleLogin}
      />
    </div>
  )

  const createBlogForm = () => {
    return (
      <div>
        <Togglable buttonLabel='Create New Blog' ref={blogFormRef}>
          <CreateBlogForm createBlog={createBlog}/>
        </Togglable>
      </div>
    )
  }

  const blogList = () => (
    <div>
      <h2>Blogs</h2>

      <p>{user.name} logged in <button onClick={handleLogout}>Log out</button></p>

      {createBlogForm()}

      {blogs.sort((a, b) => a.likes < b.likes ? 1 : -1) // Sort by likes
        .map(blog => <Blog key={blog.id} blog={blog} handleBlogLike={handleBlogLike} handleRemoveBlog={handleRemoveBlog} />)
      }
    </div>
  )

  return (
    <div>
      <Notification className='error' message={errorMessage} />
      <Notification className='success' message={successMessage} />

      {user === null ? loginForm() : blogList()}

    </div>
  )
}

export default App