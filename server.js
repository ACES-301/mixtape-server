'use strict';

const express = require('express');
require('dotenv').config();
const cors = require('cors');
const axios = require('axios');
// const mongoose = require('mongoose');
// const Handlers = require('./modules/handlers');
// const verifyUser = require('./auth.js');
// const SpotifyWebApi = require('spotify-web-api-node');
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
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

// app.get('/login', (req, res) => {
//   const state = generateRandomString(16);
//   res.cookie(stateKey, state);

//   const scope = 'user-read-private user-read-email';
//   const queryParams = querystring.stringify({
//     client_id: CLIENT_ID,
//     response_type: 'code',
//     redirect_uri: REDIRECT_URI,
//     state: state,
//     scope: scope
//   });
//   res.redirect(`https://accounts.spotify.com/authorize?${queryParams}`);
// });

app.get('/callback', (req, res) => {
  const code = req.query.code || null;
  // const state = req.query.state;
  // const scope = 'user-read-private user-read-email';

  axios({
    method: 'post',
    baseURL: 'https://accounts.spotify.com/api/token',
    data: {
      'grant_type': 'authorization_code',
      // grant_type: 'client_credentials',
      'code': code,
      'redirect_uri': 'http://localhost:3000',
      // client_id: CLIENT_ID,
      // response_type: 'code',
      // scope: scope,
      // state: state
    },
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')}`,
    },
  })
    .then(response => {
      // console.log(response);
      if (response.status === 200) {
        // console.log(`<pre>${JSON.stringify(response.data, null, 2)}</pre>`);
        // res.send(`<pre>${JSON.stringify(response.data, null, 2)}</pre>`);
        const { access_token, token_type } = response.data;
        console.log(access_token, token_type);
        axios.get('https://api.spotify.com/v1/me', {
          headers: {
            'Authorization': `${token_type} ${access_token}`
          }
        })
          .then(response => {
            console.log('This is what u r looking for', response.data);
            res.send(`<pre>${JSON.stringify(response.data, null, 2)}</pre>`);
          })
          .catch(error => {
            res.send(error);
          });
      } else {
        console.log(response);
        res.send(response);
      }
    })
    .catch(error => {
      console.log(error);
      res.send(error);
    });
});

app.get('/refresh_token', (req, res) => {
  const { refresh_token } = req.query;

  const authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: {
      Authorization: `Basic ${Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString(
        'base64',
      )}`,
    },
    form: {
      grant_type: 'refresh_token',
      refresh_token,
    },
    json: true,
  };

  req.post(authOptions, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      const access_token = body.access_token;
      res.send({ access_token });
    }
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
