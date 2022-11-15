'use strict';

const express = require('express');
require('dotenv').config();
const cors = require('cors');
// const axios = require('axios');
// const mongoose = require('mongoose');
// const Handlers = require('./modules/handlers');
// const verifyUser = require('./auth.js');
const SpotifyWebApi = require('spotify-web-api-node');
// const CLIENT_ID = process.env.CLIENT_ID;
// const CLIENT_SECRET = process.env.CLIENT_SECRET;
// const REDIRECT_URI = process.env.REDIRECT_URI;
//querystring library is deprecated
// const querystring = require('query-string');

const app = express();
app.use(cors());
// app.use(verifyUser);

app.use(express.json()); // has server update with json data

const PORT = process.env.PORT || 3002;

// mongoose.connect(process.env.MONGO_CONNECTION, {useNewUrlParser: true, useUnifiedTopology: true});
// const db = mongoose.connection;

// db.on('error', console.error.bind(console, 'connection error:'));
// db.once('open', function() {
//   console.log('Mongoose is connected');
// });


//https://www.newline.co/courses/build-a-spotify-connected-app/implementing-the-authorization-code-flow
//https://developer.spotify.com/web-api/authorization-guide/#authorization_code_flow
/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
// const generateRandomString = length => {
//   let text = '';
//   const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
//   for (let i = 0; i < length; i++) {
//     text += possible.charAt(Math.floor(Math.random() * possible.length));
//   }
//   return text;
// };


// const stateKey = 'spotify_auth_state';

app.get('/', (req, res) => res.send('test request received'));

app.post('/refresh', (req, res) => {
  const refreshToken = req.body.refreshToken;

  const spotifyApi = new SpotifyWebApi({
    redirectUri: process.env.REDIRECT_URI,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken,
  });

  spotifyApi
    .refreshAccessToken()
    .then(data => {
      console.log(data.body);
      res.json({
        accessToken: data.body.access_token,
        expiresIn: data.body.expires_in,
      });
    })
    .catch(error => {
      console.log(error.message);
      res.sendStatus(400);
    });
});

app.post('/login', (req, res) => {
  const code = req.body.code;
  const spotifyApi = new SpotifyWebApi({
    redirectUri: process.env.REDIRECT_URI,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
  });

  spotifyApi
    .authorizationCodeGrant(code)
    .then(data => {

      res.json({
        accessToken: data.body.access_token,
        refreshToken: data.body.refresh_token,
        expiresIn: data.body.expires_in,
      });
    })
    .catch(error => {
      console.log(error.message);
      res.sendStatus(400);
    });
});


// Search keyword for tracks from user input
// app.get('/search', Handlers.getKeyword);

// // Search for genre from user input
// app.get('/search', Handlers.getGenre);

// // Get playlist from Spotify
// app.get('/playlist', Handlers.getPlaylist);

// // Get saved playlist from database
// app.get('/playlist', Handlers.getSavedPlaylist);

// // Create playlist
// app.post('/users/{user_id}/playlists', Handlers.createPlaylist);

// // Delete playlist
// app.delete('/playlist/{playlist_id}/tracks', Handlers.deletePlaylist);

// // Annotate playlist
// app.put('/notes', Handlers.updateNote);

app.listen(PORT, () => console.log(`listening on ${PORT}`));
