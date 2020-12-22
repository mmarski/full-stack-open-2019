import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import CreateBlogForm from './CreateBlogForm'

describe('<CreateBlogForm />', () => {
  let mockHandler
  let component

  beforeEach(() => {
    mockHandler = jest.fn()
    component = render(
      <CreateBlogForm createBlog={mockHandler} />
    )
  })

  test('calls the callback function with correct information', async () => {
    const title = component.container.querySelector('#title')
    const author = component.container.querySelector('#author')
    const url = component.container.querySelector('#url')
    const form = component.container.querySelector('form')

    fireEvent.change(title, {
      target: { value: 'test title' }
    })
    fireEvent.change(author, {
      target: { value: 'test author' }
    })
    fireEvent.change(url, {
      target: { value: 'test.com' }
    })

    fireEvent.submit(form)
    expect(mockHandler.mock.calls).toHaveLength(1)
    expect(mockHandler.mock.calls[0][0]).toEqual({ title: 'test title', author: 'test author', url: 'test.com' })
  })
})