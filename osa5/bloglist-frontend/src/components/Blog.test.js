import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import Blog from './Blog'

describe('<Blog />', () => {
  let component
  function dummy() {
    return
  }
  const blog = {
    title: 'Test blog',
    author: 'Tester',
    url: 'test.com',
    likes: 0,
    user: {
      name: 'Tester'
    }
  }

  beforeEach(() => {
    component = render(
      <Blog blog={blog} userName={'Tester'} handleBlogLike={dummy} handleRemoveBlog={dummy} />
    )
  })

  test('renders title and author and rest is hidden', () => {
    /*const component = render(
      <Blog blog={blog} userName={'Tester'} handleBlogLike={dummy} handleRemoveBlog={dummy} />
    )*/

    expect(component.container).toHaveTextContent(
      'Test blog'
    )
    expect(component.container).toHaveTextContent(
      'Tester'
    )
    expect(component.container.querySelector('.togglableContent')).toHaveStyle(
      'display: none'
    )
    expect(component.container.querySelector('.togglableContent')).toHaveTextContent(
      'test.com'
    )
    expect(component.container.querySelector('.togglableContent')).toHaveTextContent(
      'Likes'
    )
  })

  test('after clicking Show, the rest is shown', async () => {
    /*const component = render(
      <Blog blog={blog} userName={'Tester'} handleBlogLike={dummy} handleRemoveBlog={dummy} />
    )*/

    const button = component.getByText('Show')
    fireEvent.click(button)

    expect(component.container.querySelector('.togglableContent')).not.toHaveStyle(
      'display: none'
    )
  })

  test('clicking the Like button twice calls event handler twice', async () => {
    const mockHandler = jest.fn()
  
    component = render(
      <Blog blog={blog} userName={'Tester'} handleBlogLike={mockHandler} handleRemoveBlog={dummy} />
    )
  
    //const button = component.container.querySelector('.likeButton')
    const button = Array.from(component.container.querySelectorAll('button')).find(el => el.textContent === 'Like')
    fireEvent.click(button)
    fireEvent.click(button)
  
    expect(mockHandler.mock.calls).toHaveLength(2)
  })
})