import React, { useState, useEffect } from 'react'
import axios from 'axios';
import PersonList from './PersonList';
import FilterForm from './FilterForm';
import PersonForm from './PersonForm';
import personService from './services/persons'

const App = () => {
  const [ persons, setPersons] = useState([]) 
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')
  const [ nameFilter, setNameFilter ] = useState('')
  const [ showAll, setShowAll ] = useState(true)

  const addName = (event) => {
    event.preventDefault()
    const foundPerson = persons.find(p => p.name === newName)
    if (foundPerson !== undefined) {
      if (window.confirm(`${newName} is already added to phonebook. Replace the number with the new one?`)) {
        foundPerson.number = newNumber
        personService.update(foundPerson.id, foundPerson)
          .then(response => {
            console.log("Person updated", response)
            setPersons(persons.map(p => p.id !== foundPerson.id ? p : response.data))
            setNewName('')
            setNewNumber('')
          })
          .catch(error => {
            window.alert("Error updating, check console")
            console.log(error)
          })
      }
      return;
    }
    const personObj = {
      name: newName,
      number: newNumber
    }
    personService.create(personObj)
      .then(response => {
        console.log(response)
        setPersons(persons.concat(response.data))
        //setPersons(persons.map(p => p.id !== response.data.id ? p : response.data))
      })
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
  const handleRemoveEntry = (id, name) => () => {
    if (window.confirm("Delete "+ name+"?") === true) {
      personService.remove(id)
        .then(response => {
          console.log("Deleted", response)
          setPersons(persons.filter(p => p.id !== id))
        })
        .catch(error => {
          Window.alert("Failed to remove from phonebook, check console")
          console.log(error)
        })
    }
  }

  useEffect(() => {
    personService.getAll()
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
      <PersonList personsToShow={personsToShow} removeCallback={handleRemoveEntry} />
    </div>
  )

}

export default App