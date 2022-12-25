import { useEffect, useState } from 'react'
import personService from './services/persons'
import Filter from './components/Filter'
import Persons from './components/Persons'
import PersonForm from './components/PersonForm'
import Notification from './components/Notification'

const App = () => {
  const [persons, setPersons] = useState([])
  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => setPersons(initialPersons))
    }, [])

  const initDetails = {
    name: '',
    number: ''
  }
  const [newDetails, setNewDetails] = useState(initDetails)

  const [successMessage, setSuccessMessage] = useState(null);
  const [failureMessage, setFailureMessage] = useState(null);


  const notifySuccess = (message) => {
    setSuccessMessage(message)
    setTimeout(() => setSuccessMessage(null), 5000)
  }

  const notifyFailure = (message) => {
    setFailureMessage(message)
    setTimeout(() => setFailureMessage(null), 5000)
  }

  const handleInputChange = (e) => {
    setNewDetails({ ...newDetails, [e.target.id]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const personObj = {
      name: newDetails.name.trim(),
      number: newDetails.number,
      id: persons.length + 1
    }

    if (persons.map(p => p.name).includes(newDetails.name.trim())) {
      if (window.confirm(`${newDetails.name.trim()} is already added to phonebook, replace the old number with a new one?`)) {
        const personToUpdate = persons.find(p => p.name === newDetails.name)
        personService
          .update(personToUpdate.id, personObj)
          .then(returnedPerson => {
            notifySuccess(`Updated ${returnedPerson.name}`)
            setPersons(persons.map(p => p.id === personToUpdate.id ? returnedPerson : p))
            setNewDetails(initDetails)
          })
          .catch(() => {
            notifyFailure(`Information of ${personToUpdate.name} was already removed from server`)
          })
      }
      return
    }
    
    personService
      .create(personObj)
      .then(returnedPerson => {
        notifySuccess(`Added ${returnedPerson.name}`)
        setNewDetails(initDetails)
        setPersons(persons.concat(returnedPerson))
      })
  }

  const handleDelete = (person) => () => {
    if (window.confirm(`Delete ${person.name}?`)) {
      personService
        .remove(person.id)
        .then(() => {
          setSuccessMessage(`Deleted ${person.name}`)
          setPersons(persons.filter(p => p.id !== person.id))
        })
        .catch(() => {
          notifyFailure(`Information of ${person.name} was already removed from server`)
        })
    }
  }

  const [query, setQuery] = useState('')
  const handleQuery = (e) => setQuery(e.target.value)
  const personsToShow = persons.filter(p => p.name.toLowerCase().includes(query.toLowerCase()))

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={successMessage} />
      <Notification message={failureMessage} />

      <Filter query={query} handleQuery={handleQuery} />

      <h3>add a new</h3>
      <PersonForm newDetails={newDetails} handleInputChange={handleInputChange} handleSubmit={handleSubmit} />

      <h3>Numbers</h3>
      <Persons persons={personsToShow} handleDelete={handleDelete} />
    </div>
  )
}

export default App