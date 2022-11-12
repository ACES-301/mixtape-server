'use strict';

const express = require('express');
require('dotenv').config();
const cors = require('cors');
const mongoose = require('mongoose');
const Handlers = require('./modules/handlers');
// const verifyUser = require('./auth.js');

const app = express();
app.use(cors());
// app.use(verifyUser);

app.use(express.json()); // has server update with json data

const PORT = process.env.PORT || 3002;

mongoose.connect(process.env.MONGO_DATABASE, {useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Mongoose is connected');
});

// app.get('/', (req, res) => res.send('test request received'));

// // Search keyword for tracks from user input
// app.get('/search', Handlers.getKeyword);

// // Search for genre from user input 
// app.get('/search', Handlers.getGenre);

// // Get playlist from Spotify
// app.get('/playlist/{playlist_id}', Handlers.getPlaylist);

// // Get saved playlist from database
app.get('/playlist', Handlers.getSavedPlaylist);

// // Create playlist
// app.post('/users/{user_id}/playlists', Handlers.createPlaylist);

// // Delete playlist
// app.delete('/playlist/{playlist_id}/tracks', Handlers.deletePlaylist);

// // Annotate playlist
// app.put('/notes', Handlers.updateNote);

app.listen(PORT, () => console.log(`listening on ${PORT}`));
