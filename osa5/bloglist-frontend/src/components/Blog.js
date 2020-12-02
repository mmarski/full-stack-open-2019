import React, {useState} from 'react'

const Blog = ({ blog, handleBlogLike }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const [visible, setVisible] = useState(false)
  const showWhenVisible = { display: visible ? '' : 'none' }

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

  return (
    <div style={blogStyle}>
      <b>{blog.title}</b> <button onClick={toggleVisibility}>{visible ? 'Hide' : 'Show'}</button>
      <div style={showWhenVisible}>
        {blog.url}<br></br>
        Author {blog.author}<br></br>
        User {blog.user.name} {blog.user.id}<br></br>
        Likes {blog.likes} <button onClick={likeBlog}>Like</button>
      </div>
    </div>
  )
}

export default Blog
