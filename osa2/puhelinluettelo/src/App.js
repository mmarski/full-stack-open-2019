import React, { useState } from 'react'

const App = () => {
  const [ persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456' },
    { name: 'Ada Lovelace', number: '39-44-5323523' },
    { name: 'Dan Abramov', number: '12-43-234345' },
    { name: 'Mary Poppendieck', number: '39-23-6423122' }
  ]) 
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')
  const [ nameFilter, setNameFilter ] = useState('')
  const [ showAll, setShowAll ] = useState(true)

  const addName = (event) => {
    event.preventDefault()
    if (persons.find(p => p.name === newName) !== undefined) {
      window.alert(`${newName} is already added to phonebook`)
      return;
    }
    const personObj = {
      name: newName,
      number: newNumber
    }
    setPersons(persons.concat(personObj))
    setNewName('')
    setNewNumber('')
  }
  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }
  const handleNumChange = (event) => {
    setNewNumber(event.target.value)
  }
  const handleNameFilterChange = (event) => {
    setNameFilter(event.target.value)
    if (nameFilter == "") {
      setShowAll(true)
    }
    else {
      setShowAll(false)
    }
  }

  const personsToShow = showAll ? persons : persons.filter(
    p => p.name.toLowerCase().includes(nameFilter.toLowerCase())
  )

  return (
    <div>
      <h2>Phonebook</h2>
      <form>
        <div>
          Filter shown with <input value={nameFilter} onChange={handleNameFilterChange}></input>
        </div>
      </form>
      <h2>Add new</h2>
      <form onSubmit={addName}>
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
      <h2>Numbers</h2>
      {personsToShow.map(p => <p key={p.name}>{p.name} {p.number}</p>)}
    </div>
  )

}

export default App