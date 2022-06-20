require('dotenv').config()
const express = require('express')
const cors = require('cors')
const app = express()
const Note = require('./models/person')
app.use(cors())

var morgan = require('morgan')

app.use(express.static('build'))
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
        console.log("täällä")
        Note.find({}).then(notes => {
        res.json(notes), console.log(notes)
        })
      })

      app.get('/api/info', (req, res) => {
        Note.countDocuments({}).then(r => 
        res.send(`<h2>Phonebook has info for ${r} people</h2>
                  <p>${new Date()}</p>`
                  
                  ))
      })
      app.get('/api/persons/:id', (request, response, next) => {

      Note.findById(request.params.id)
    .then(note => {
      if (note) {
        response.json(note)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
    })
      app.delete('/api/persons/:id', (request, response, next) => {
        Note.findByIdAndRemove(request.params.id)
          .then(result => {
            response.status(204).end()
          })
          .catch(error => next(error))
      })

     // const generateId = () => {
        //const randomi = Math.random() * 300000

        //return randomi
      //}
      
      app.post('/api/persons', (request, response, next) => {
        const body = request.body
        if (body.content === undefined) {
          return response.status(400).json({ error: 'content missing' })
        }
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

            const person = new Note({
            content: body.content,
            important: body.important || false,
            date: new Date(),
          })
        
          person.save().then(savedNote => {
            response.json(savedNote)
          })
          .catch(error => next(error))

        }})
        app.put('/api/persons/:id', (request, response, next) => {
          const  { content, number} = request.body

          Note.findByIdAndUpdate(request.params.id,{ content, number },
            { new: true, runValidators: true, context: 'query' })
            .then(updatedNote => {
              response.json(updatedNote)
            })
            .catch(error => next(error))
        })

        const unknownEndpoint = (request, response) => {
          response.status(404).send({ error: 'unknown endpoint' })
        }
        
        // olemattomien osoitteiden käsittely
        app.use(unknownEndpoint)
        
        const errorHandler = (error, request, response, next) => {
          console.error(error.message)
        
          if (error.name === 'CastError') {
            return response.status(400).send({ error: 'malformatted id' })
          } else if (error.name === 'ValidationError') {
            return response.status(400).json({ error: error.message })
          
          }
        
          next(error)
        }
        
        // virheellisten pyyntöjen käsittely
        app.use(errorHandler)

        
         
      
      const PORT = process.env.PORT
      app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`)
      })