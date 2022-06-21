const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}
const password = process.argv[2]

const url =
    `mongodb+srv://VipsuGod:${password}@cluster0.gvamw.mongodb.net/noteApp?retryWrites=true&w=majority`
mongoose.connect(url)

const noteSchema = new mongoose.Schema({
  content: String,
  number: String

})

const Note = mongoose.model('Note', noteSchema)

const note = new Note({
  content: process.argv[3],
  number: process.argv[4]
})
if (process.argv.length === 3) {
  console.log('Hip')
  Note.find({}).then(result => {
    result.forEach(note => {
      console.log(note)
    })
    mongoose.connection.close()
    process.exit(1)
  })

}
if (process.argv.length === 5) {
  note.save().then(() => {
    console.log(`added ${note.content} ${note.number} to phonebook`)
    mongoose.connection.close()
  })
}