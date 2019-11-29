import React from 'react'

const PersonList = ({personsToShow, removeCallback}) => {
    return (
        <div>
            {personsToShow.map(p => <p key={p.name}>{p.name} {p.number} <button onClick={removeCallback(p.id, p.name)}>Delete</button></p>)}
        </div>
    )
}

export default PersonList;