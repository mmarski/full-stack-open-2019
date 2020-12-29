import React from 'react'
import { useDispatch } from 'react-redux'
import { createAnecdote } from '../reducers/anecdoteReducer'

const AnecdoteForm = () => {
  const dispatch = useDispatch()

  function newAnecdote(event) {
    event.preventDefault()
    const anecdote = event.target.anecdote.value
    event.target.anecdote.value = ''
    dispatch(createAnecdote(anecdote))
  }

  return (
    <form onSubmit={newAnecdote}>
      <div><input name='anecdote' /></div>
      <button type='submit'>create</button>
    </form>
  )
}

export default AnecdoteForm