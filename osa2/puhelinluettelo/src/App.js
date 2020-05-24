import React, { useState, useEffect } from 'react'
import './index.css';
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
  const [errorMessage, setErrorMessage] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)

  const Notification = ({ className, message }) => {
    if (message === null) {
      return null
    }
  
    return (
      <div className={className}>
        {message}
      </div>
    )
  }

  const addName = (event) => {
    event.preventDefault()
    const foundPerson = persons.find(p => p.name === newName)
    if (foundPerson !== undefined) {
      if (window.confirm(`${newName} is already added to phonebook. Replace the number with the new one?`)) {
        foundPerson.number = newNumber
        personService.update(foundPerson.id, foundPerson)
          .then(response => {
            setSuccessMessage(newName + " number updated")
            setTimeout(() => {
              setSuccessMessage(null)
            }, 5000)
            setPersons(persons.map(p => p.id !== foundPerson.id ? p : response.data))
            setNewName('')
            setNewNumber('')
          })
          .catch(error => {
            setErrorMessage("Failed to update " + newName + ", data already removed from server. Check console")
            setTimeout(() => {
              setErrorMessage(null)
            }, 5000)
            console.log(error)
            setPersons(persons.filter(p => p.id !== foundPerson.id))
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
        setSuccessMessage(newName + " added")
            setTimeout(() => {
              setSuccessMessage(null)
            }, 5000)
      })
      .catch(error => {
        setErrorMessage("Failed to add " + newName + ". " + error.response.data.error)
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
        console.log(error)
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
          setSuccessMessage(name + " deleted")
            setTimeout(() => {
              setSuccessMessage(null)
            }, 5000)
        })
        .catch(error => {
          setErrorMessage("Failed to delete " + name + ", check console")
            setTimeout(() => {
              setErrorMessage(null)
            }, 5000)
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
      <h1>Phonebook</h1>
      <Notification className="error" message={errorMessage} />
      <Notification className="success" message={successMessage} />
      <FilterForm value={nameFilter} onChange={handleNameFilterChange} />
      <h2>Add new</h2>
      <PersonForm onSubmit={addName} newName={newName} handleNameChange={handleNameChange} newNumber={newNumber} handleNumChange={handleNumChange} />
      <h2>Numbers</h2>
      <PersonList personsToShow={personsToShow} removeCallback={handleRemoveEntry} />
    </div>
  )

}

export default App