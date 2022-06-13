const express = require('express')
const req = require('express/lib/request')
const res = require('express/lib/response')

const cors = require('cors')
const app = express()
app.use(cors())

var morgan = require('morgan')
app.use(express.json())


morgan.token('information', (request) => {
  if (request.method == 'POST') return ' ' + JSON.stringify(request.body);
  else return ' ';
});

app.use(
  morgan(
    ':method :url :status :res[content-length] - :response-time ms :http-version  :information'
  )
);



let persons = [
   
    {
      "content": "Arto Hellas",
      "contentNUM": "040-123456",
      "id": 1
    },
    {
      "content": "Ada Lovelace",
      "contentNUM": "39-44-5323523",
      "id": 2
    },
    {
      "content": "Dan Abramov",
      "contentNUM": "12-43-234345",
      "id": 3
    },
    {
      "content": "kkk",
      "contentNUM": "",
      "date": "2022-05-31T23:55:01.363Z",
      "important": true,
      "id": 4
    },
      ]

      app.get('/', (req, res) => {
        res.send('<h1>Hello World!</h1>')
      })
      
      app.get('/api/persons', (req, res) => {
        res.json(persons)
      })

      app.get('/api/info', (req, res) => {
        res.send(`<h2>Phonebook has info for ${persons.length} people</h2>
                  <p>${new Date()}</p>`
                  )
      })
      app.get('/api/persons/:id', (request, response) => {
        const id = Number(request.params.id)
        const person = persons.find(personi => personi.id === id)
        
        if (person) {
          response.json(person)
        } else {
          response.status(404).end()
        }
      })
      app.delete('/api/persons/:id', (request, response) => {
        const id = Number(request.params.id)
        persons = persons.filter(person => person.id !== id)
      
        response.status(204).end()
      })

      const generateId = () => {
        const randomi = Math.random() * 300000

        return randomi
      }
      
      app.post('/api/persons', (request, response) => {
        const body = request.body
        console.log(request.content)

      
        if (!body.content) {
          return response.status(400).json({ 
            error: 'name missing' 
          })
        }
        else if (!body.contentNUM) {
          return response.status(400).json({ 
            error: 'number missing' 
          })
        }
        else if (persons.find(search => search.content === body.content)) {
          return response.status(400).json({ 
            error: 'name already used' 
          })
        }
        else {
        const person = {
          content: body.content,
          important: body.important || false,
          date: new Date(),
          id: generateId(),
        }
      
      
      
        persons = persons.concat(person)
    
        response.json(person)
        }})
      
      
      const PORT = process.env.PORT || 3001
      app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`)
      })