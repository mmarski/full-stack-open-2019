import React, {useState} from 'react'

const Blog = ({ blog }) => {
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

  return (
    <div style={blogStyle}>
      <b>{blog.title}</b> <button onClick={toggleVisibility}>{visible ? 'Hide' : 'Show'}</button>
      <div style={showWhenVisible}>
        {blog.url}<br></br>
        Author {blog.author}<br></br>
        Likes {blog.likes} <button>Like</button>
      </div>
    </div>
  )
}

export default Blog
