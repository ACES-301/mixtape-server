'use strict';
const dummyAPI = require('./modules/hexx-playlist-dummy.json');
const express = require('express');
require('dotenv').config();
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const mongoose = require('mongoose');
const Handlers = require('./modules/handlers');

app.use(express.json());


const PORT = process.env.PORT || 3002;
mongoose.connect(process.env.MONGO_DATABASE, {useNewUrlParser: true, useUnifiedTopology: true});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Mongoose is connected');
});

// Get saved playlist from database
app.get('/playlist', Handlers.getSavedPlaylist);

app.get('/search', (req, res, next) => {
  try {
    const { keyword, genre } = req.query;
    console.log('query parameter: ', req.query);
    console.log('keyword: ', keyword);
    console.log('genre: ', genre);

    const getNewPlaylist = new NewPlaylist(keyword, genre);
    const playlistItems = getNewPlaylist.getItems();
    res.status(200).send(playlistItems);
  } catch(error) {
    // next can be used to pass an error to express for the error middleware to handle
    next(error);
  }
});

class NewPlaylist {
  constructor(keyword, genre){
    // find method to find the type of list we want to return
    let items;
    if (genre === undefined){
      items = dummyAPI.items.filter(item => item.name.includes(keyword) || item.description.includes(keyword));
    } else {
      items = dummyAPI.items.filter(item => item.genre === genre);
    }
    console.log(items);
    this.items = items;
  }

  getItems() {
    return this.items.map(item => ({
      uri: item.uri,
    }));
  }
}

// Save playlist to MongoDB
app.post('/playlist', Handlers.savePlaylist);


// // Delete playlist
app.delete('/playlist/:id', Handlers.deleteSavedPlaylist);

// // Annotate playlist
app.put('/playlist/:id', Handlers.updateNote);


app.listen(PORT, () => console.log(`listening on ${PORT}`));
