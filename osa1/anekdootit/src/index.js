import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
//import App from './App';
//import * as serviceWorker from './serviceWorker';

const Button = ({ onClick, name }) => {
    return <button onClick={onClick}>{name}</button>
}

const VoteStats = ({value}) => {
    if (value === undefined) {
        //console.log("Value was undefined")
        value = 0
    }
    return (
        <p>Has {value} votes</p>
    )
}

const MostVoted = ({anecdotes, votes}) => {
    const idx = votes.indexOf(Math.max(...votes))
    
    //console.log(idx, votes)
    return (
        <>
        <h1>Anecdote with most votes</h1>
        <p>{anecdotes[idx]}</p>
        <VoteStats value={votes[idx]} />
        </>
    )
}

const App = ({anecdotes}) => {
    const [selected, setSelected] = useState(0)
    const [votes, setVotes] = useState(new Array(anecdotes.length).fill(0))

    function getRandomIdx() {
        return Math.floor(Math.random() * Math.floor(anecdotes.length));
    }
    function addVote(index) {
        const copyVotes = [...votes]
        if (copyVotes[index] === undefined) copyVotes[index] = 0
        copyVotes[index] += 1
        setVotes(copyVotes)
    }

    return (
        <div>
            <h1>Anecdote of the day</h1>
            <p>{anecdotes[selected]}</p>
            <VoteStats value={votes[selected]} />
            <Button onClick={() => addVote(selected)} name="Vote" />
            <Button onClick={() => setSelected(getRandomIdx())} name="Next anecdote" />
            <MostVoted anecdotes={anecdotes} votes={votes} />
        </div>
    )
}

const anecdotes = [
    'If it hurts, do it more often',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
]

ReactDOM.render(<App anecdotes={anecdotes} />,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
//serviceWorker.unregister();
