const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(express.static('public'));

app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, 'public/notes.html'))
);
app.listen(PORT, () =>
  console.log(`Example app listening at http://localhost:${PORT}`)
);
app.post('/notes', (req, res) => {
  console.info(`${req.method} request received to add a tip`);

  const { title, text, id } = req.body;

  console.log(req.body)
  if (req.body) {
    const newnote = {
      title,
      text,
      id
    };
    readAndAppend(newnote, './public/db/db.json');
    res.json(`Note added successfully`);
  } else {
    res.error('Error in adding note');
  }
});

const readAndAppend = (content, file) => {
  fs.readFile(file, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
    } else {
      const parsedData = JSON.parse(data);
      parsedData.push(content);
      writeToFile(file, parsedData);
    }
  });
};

const readAndDelete = (id, file) => {
  fs.readFile(file, 'utf8', (err, data) => {
    if (err) {
      console.error(err)
    } else {
      const parsedData = JSON.parse(data);
      // --------------------------------------------------------------------- weird
      // console.log('--------------');
      // console.log(parsedData)
      // let updatedData = parsedData.filter(element => element.id !== id)
      parsedData.forEach(element => {
        if(element.id == id){
          parsedData.splice(element,1)
        }
      })
      // console.log('--------------');
      // console.log(parsedData);
      // --------------------------------------------------------------------- weird
      writeToFile(file, parsedData);
    }
  });
};
app.delete('/notes/:id', (req, res) => {
  if (req) {
    readAndDelete(req.params.id, './public/db/db.json');
    res.json(`note deleted`);
  } else {
    res.error('Error in removing note');
  }
});

const writeToFile = (destination, content) =>
  fs.writeFile(destination, JSON.stringify(content, null, 4), (err) =>
    err ? console.error(err) : console.info(`\nData written to ${destination}`)
);
