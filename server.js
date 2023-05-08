const express = require('express')
const path = require('path')
const db = require('./db/db.json')
const fs = require('fs')

const app = express()
const PORT = 3001

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'))

app.get('/notes', (req, res) => res.sendFile(path.join(__dirname, './public/notes.html')));

app.get('/api/notes', (req, res) => res.json(db));

app.post('/api/notes', (req, res) => {
    // Let the client know that their POST request was received
    console.info(`${req.method} request received`);
    console.info(req.body)
    const note_text = req.body["note_text"];

    if (note_text){
        const newNote = {
            note_text,
            id: Math.floor(Math.random() * 1000000)
        }

        fs.readFile('./db/db.json', 'utf8', (err, data) => {
            if (err) {
              console.error(err);
            } else {
              const parsedText = JSON.parse(data);
      
              // Add a new review
              parsedText.push(newNote);

              fs.writeFile("./db/db.json", JSON.stringify(parsedText, null, 4), (err) =>
        err
      ? console.error(err)
      : console.log(`Note written to database`)
        )
    }})
    
 

  const response = {
    status: 'success',
    body: newNote,
  };

  console.log(response);
  res.status(201).json(response);
} else {
  res.status(500).json('Error in saving comment');
}
  });

app.get('*', (req, res) => res.sendFile(path.join(__dirname, './public/index.html')));

app.listen(PORT, () =>
  console.log(`Example app listening at http://localhost:${PORT}`)
);