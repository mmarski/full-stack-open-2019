import React, { useState } from 'react'
import PropTypes from 'prop-types'

const Blog = ({ blog, userName, handleBlogLike, handleRemoveBlog }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const [visible, setVisible] = useState(false)
  const showWhenVisible = { display: visible ? '' : 'none' }
  const showWhenCorrectUser = { display: blog.user.name === userName ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const likeBlog = (event) => {
    event.preventDefault()
    handleBlogLike(blog.id, {
      user: blog.user,
      likes: blog.likes + 1,
      author: blog.author,
      title: blog.title,
      url: blog.url
    })
  }

  const removeBlog = (event) => {
    event.preventDefault()
    handleRemoveBlog(blog.id)
  }

  return (
    <div style={blogStyle}>
      <b>{blog.title}</b> by {blog.author} <button onClick={toggleVisibility}>{visible ? 'Hide' : 'Show'}</button>
      <div style={showWhenVisible}>
        {blog.url}<br></br>
        User {blog.user.name}<br></br>
        Likes {blog.likes} <button onClick={likeBlog}>Like</button><br></br>
        <button style={showWhenCorrectUser} onClick={removeBlog}>Remove blog</button>
      </div>
    </div>
  )
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  userName: PropTypes.string.isRequired,
  handleBlogLike: PropTypes.func.isRequired,
  handleRemoveBlog: PropTypes.func.isRequired
}

export default Blog
