import React, { useState, useEffect } from 'react'
import axios from 'axios';
import PersonList from './PersonList';
import FilterForm from './FilterForm';
import PersonForm from './PersonForm';

const App = () => {
  const [ persons, setPersons] = useState([]) 
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
    if (nameFilter === "") {
      setShowAll(true)
    }
    else {
      setShowAll(false)
    }
  }

  useEffect(() => {
    axios
      .get('http://localhost:3001/persons')
      .then(response => {
        setPersons(response.data)
      })
  }, [])

  const personsToShow = showAll ? persons : persons.filter(
    p => p.name.toLowerCase().includes(nameFilter.toLowerCase())
  )

  return (
    <div>
      <h2>Phonebook</h2>
      <FilterForm value={nameFilter} onChange={handleNameFilterChange} />
      <h2>Add new</h2>
      <PersonForm onSubmit={addName} newName={newName} handleNameChange={handleNameChange} newNumber={newNumber} handleNumChange={handleNumChange} />
      <h2>Numbers</h2>
      <PersonList personsToShow={personsToShow} />
    </div>
  )

}

export default App