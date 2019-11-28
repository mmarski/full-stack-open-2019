import React from 'react'

const PersonForm = ({onSubmit, newName, handleNameChange, newNumber, handleNumChange}) => {
    return (
        <form onSubmit={onSubmit}>
            <div>
            name: <input value={newName} onChange={handleNameChange} />
            </div>
            <div>
            Number: <input value={newNumber} onChange={handleNumChange} />
            </div>
            <div>
            <button type="submit">add</button>
            </div>
        </form>
    )
}

export default PersonForm;