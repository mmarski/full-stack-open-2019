import React from 'react'
import AnecdoteForm from './anecdoteForm'
import AnecdoteList from './anecdoteList'

const App = () => {

  return (
    <div>
      <h2>Anecdotes</h2>
      <AnecdoteList />

      <h2>create new</h2>
      <AnecdoteForm />
    </div>
  )
}

export default App