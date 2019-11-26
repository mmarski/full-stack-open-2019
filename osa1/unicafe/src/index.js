import React, {useState} from 'react';
import ReactDOM from 'react-dom';
import './index.css';
//import App from './App';
//import * as serviceWorker from './serviceWorker';

const Button = ({onClick, name}) => {
    return <button onClick={onClick}>{name}</button>
}

const Statistic = ({name, value}) => {
    return (
        <tr>
            <td>{name}:</td>
            <td>{value}</td>
        </tr>
    )
}

const Statistics = ({stats}) => {
    const good = stats[0]
    const neutral = stats[1]
    const bad = stats[2]

    const all = () => {
        return (good + neutral + bad)
    }
    const average = () => {
        return ((good - bad) / all())
    }
    const positive = () => {
        return (good / all() * 100)
    }

    if (all() === 0) {
        return <p>No feedback given</p>
    }

    return (
        <table>
            <thead>
            <Statistic name="Good" value={good} />
            <Statistic name="Neutral" value={neutral} />
            <Statistic name="Bad" value={bad} />
            <Statistic name="All" value={all()} />
            <Statistic name="Average" value={average()} />
            <Statistic name="Positive" value={positive() + "%"} />
            </thead>
        </table>
    )
}

const App = () => {
    const [good, setGood] = useState(0)
    const [neutral, setNeutral] = useState(0)
    const [bad, setBad] = useState(0)
    const stats = [good, neutral, bad]

    return (
        <div>
            <h1>Give feedback</h1>
            <Button onClick={() => setGood(good+1)} name="Good"></Button>
            <Button onClick={() => setNeutral(neutral+1)} name="Neutral"></Button>
            <Button onClick={() => setBad(bad+1)} name="Bad"></Button>
            <h2>Statistics</h2>
            <Statistics stats={stats}></Statistics>
        </div>
    )
}

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
//serviceWorker.unregister();
