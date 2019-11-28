import React from 'react'

const PersonList = ({personsToShow}) => {
    return (
        <div>
            {personsToShow.map(p => <p key={p.name}>{p.name} {p.number}</p>)}
        </div>
    )
}

export default PersonList;