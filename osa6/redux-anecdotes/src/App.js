import React, { useEffect } from 'react'
import AnecdoteForm from './components/AnecdoteForm'
import AnecdoteList from './components/AnecdoteList'
import Notification from './components/Notification'
import Filter from './components/Filter'
import { useDispatch } from 'react-redux'
import { setAnecdoteList } from './reducers/anecdoteReducer'
import anecdoteService from './services/anecdotes'

const App = () => {
  const dispatch = useDispatch()
  useEffect(() => {
    anecdoteService.getAll()
      .then(response => {
        dispatch(setAnecdoteList(response.data))
      })
  }, [dispatch])

  return (
    <div>
      <h2>Anecdotes</h2>
      <Filter />
      <Notification />
      <AnecdoteList />

      <h2>create new</h2>
      <AnecdoteForm />
    </div>
  )
}

export default App