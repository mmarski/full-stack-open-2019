import React from 'react'
import { connect } from 'react-redux'
//import { useSelector, useDispatch } from 'react-redux'
import { voteAnecdote } from '../reducers/anecdoteReducer'
import { setNotification } from '../reducers/notificationReducer'

const AnecdoteList = (props) => {
  //const filter = useSelector(state => state.filter)
  //const anecdotes = useSelector(state => state.anecdotes.filter(a => a.content.includes(filter)))
  //const anecdotes = props.anecdotes.filter(a => a.content.includes(props.filter))
  //const dispatch = useDispatch()

  const vote = (id) => {
    console.log('vote', id)
    props.voteAnecdote(id)
    props.setNotification('You voted anecdote ' + props.anecdotes.find(a => a.id === id).content, 5)
  }

  return (
    <div>
      {props.anecdotes.sort((a, b) => a.votes < b.votes ? 1 : -1) // Sort by votes
        .map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            Votes {anecdote.votes}
            <button onClick={() => vote(anecdote.id)}>vote</button>
          </div>
        </div>
      )}
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    anecdotes: state.anecdotes.filter(a => a.content.includes(state.filter))
  }
}

const mapDispatchToProps = {
  voteAnecdote,
  setNotification
}

//export default AnecdoteList
const ConnectedAnecdotes = connect(
  mapStateToProps,
  mapDispatchToProps
)(AnecdoteList)

export default ConnectedAnecdotes