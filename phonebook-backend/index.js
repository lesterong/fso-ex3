const express = require("express")
const cors = require("cors")
const morgan = require("morgan")
const app = express()

app.use(cors())
app.use(express.json())
morgan.token('body', req => {
  return JSON.stringify(req.body)
})
app.use(morgan(':method :url :status :res[content-length] :response-time ms :body'))
app.use(express.static('build'))

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/info', (request, response) => {
  response.send(`
    <p>Phonebook has info for ${persons.length} ${persons.length == 1 ? 'person' : 'people'}</p>
    <p>${new Date()}</p>
  `)
})

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

const generateId = () => Math.floor(Math.random() * 10000000)

app.post('/api/persons', (request, response) => {
  const body = request.body

  // must have name and number
  if (!body.name && !body.number) {
    return response.status(400).json({
      error: 'name and number missing'
    })
  } else if (!body.name) {
    return response.status(400).json({
      error: 'name missing'
    })
  } else if (!body.number) {
    return response.status(400).json({
      error: 'number missing'
    })
  }

  if (persons.map(p => p.name.toLowerCase()).includes(body.name.toLowerCase())) {
    return response.status(400).json({
      error: 'name must be unique'
    })
  }

  const person = {
    name: body.name,
    number: body.number,
    id: generateId(),
  }

  persons = persons.concat(person)

  response.json(person)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(p => p.id === id)
  
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(p => p.id !== id)

  response.status(204).end()
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`)
})

