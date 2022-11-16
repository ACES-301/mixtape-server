'use strict';

const express = require('express');
require('dotenv').config();
const cors = require('cors');
const axios = require('axios');
const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;
const redirect_uri = process.env.REDIRECT_URI;
//querystring library is deprecated
const querystring = require('query-string');
var cookieParser = require('cookie-parser');

const app = express();
app.use(cors());
app.use(express.json()); // has server update with json data
app.use(express.static(__dirname + '/public'))
  .use(cors())
  .use(cookieParser());

const PORT = process.env.PORT || 3002;
const stateKey = 'spotify_auth_state';

/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
var generateRandomString = function (length) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

app.get('/login', function (req, res) {

  var state = generateRandomString(16);
  res.cookie(stateKey, state);

  // your application requests authorization
  var scope = 'user-read-private user-read-email';
  const url = 'https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: client_id,
      scope: scope,
      redirect_uri: redirect_uri,
      state: state
    });
  console.log('REDIRET URL TYPE: ', url);
  // axios.get(url)
  res.status(200).send(url);
  // res.status(302).redirect(url);

  // const clickMe = 'https://accounts.spotify.com/authorize?' +
  //   querystring.stringify({
  //     response_type: 'code',
  //     client_id: client_id,
  //     scope: scope,
  //     redirect_uri: redirect_uri,
  //     state: state
  //   });
  // console.log('CLICKME VARAIBLE: ', clickMe);
  // res.status(200).send(clickMe);
});

// app.get('/authMe', (req, res) => {
//   console.log('REDIRET URL: ', req.query.url);
//   const results = axios.get(req.query.url);
//   console.log('THESE ARE THE AUTHORIZATION AXIOS RESULTS: ', results.data);
//   res.status(200).send(results.data);
// });

app.get('/callback', function (req, res) {

  // your application requests refresh and access tokens
  // after checking the state parameter

  var code = req.query.code || null;
  var state = req.query.state || null;
  // var storedState = req.cookies ? req.cookies[stateKey] : null;
  console.log('CODE: ', code);
  console.log('STATE: ', state);
  // console.log('STORED STATE: ', storedState);

  if (state === null) {
    res.redirect('/#' +
      querystring.stringify({
        error: 'state_mismatch'
      }));
  } else {
    res.clearCookie(stateKey);
    const config = {
      method: 'post',
      baseURL: 'https://accounts.spotify.com/api/token',
      data: {
        // grant_type: 'client_credentials',
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: redirect_uri
      },
      headers: {
        'Authorization': 'Basic ' + (Buffer.from(client_id + ':' + client_secret).toString('base64')),
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    };

    axios(config).then(result => {

      class SpotifyUser {
        constructor(data) {
          this.access_token = data.access_token;
          this.refresh_token = data.refresh_token;
          this.expires_in = data.expires_in;
          // this.display_name = user.display_name;
          // this.email = user.email;
          // this.profileURL = user.external_urls.spotify;
          // this.userID = user.id;
          // this.profilePicture = user.images.url;
          // this.uri = user.uri;
        }
      }

      console.log('RESULT: ', result);
      const access_token = result.data.access_token;
      const refresh_token = result.data.refresh_token;
      console.log('ACCESS_TOKEN: ', access_token);
      console.log('REFRESH_TOKEN: ', refresh_token);
      // TODO: I wish to run the the result.data through a class to construct a new response obj that will include the user's spotify profile and the access_token and refresh_token.
      const SpotifyUserInstance = new SpotifyUser(result.data);
      // That instance will then be sent to the frontend to be saved to state.

      const options = {
        baseURL: 'https://api.spotify.com/v1/me',
        headers: { 'Authorization': 'Bearer ' + access_token }
      };

      // use the access token to access the Spotify Web API
      axios(options).then(result => {
        console.log('USE THE ACCESS TOKEN TO ACCESS THE SPOTIFY API: ', result.data);
        // TODO: I wish to send the new instance of the constructed response obj that includes the user's spotify profile and the access_token and refresh_token.
        SpotifyUserInstance.display_name = result.data.display_name;
        SpotifyUserInstance.email = result.data.email;
        SpotifyUserInstance.profileURL = result.data.external_urls.spotify;
        SpotifyUserInstance.userID = result.data.id;
        SpotifyUserInstance.profile_picture = result.data.images[0].url;
        SpotifyUserInstance.uri = result.data.uri;
        // currently blocked by status code 303.
        console.log('SPOTIFY USER CLASS INSTANCE: ', SpotifyUserInstance);
        // res.status(200).send('MAIL TIME!');
        res.status(200).send(SpotifyUserInstance);
        
        // we can also pass the token to the browser to make requests from there
        // we probably don't want to redirect from the backend. A res.send works.
        // res.redirect('/#' +
        //   querystring.stringify({
        //     access_token: access_token,
        //     refresh_token: refresh_token
        //   }));
      }).catch(err => console.error('ERROR FROM /me CALL: ', err));
    }).catch(err => console.error('ERROR FROM /token CALL: ', err));
  }
});

app.get('/refresh_token', function (req, res) {

  // requesting access token from refresh token
  const refresh_token = req.query.refresh_token;

  const config = {
    method: 'post',
    baseURL: 'https://accounts.spotify.com/api/token',
    headers: {
      'Authorization': 'Basic ' + (Buffer.from(client_id + ':' + client_secret).toString('base64')),
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data: {
      grant_type: 'refresh_token',
      refresh_token: refresh_token
    }
  };

  axios(config).then(result => {
    var access_token = result.data.access_token;
    console.log('REFRESHED ACCESS_TOKEN: ', access_token);

    res.send({
      'access_token': access_token
    });
  }).catch(err => {
    console.error('ERROR FROM /refresh_token CALL: ', err);
  });
});

// Get a list of the playlists owned or followed by a Spotify user.
app.get('/getUserPlaylists/:id', (request, response) => {
  const config = {
    method: 'get',
    baseURL: 'https://api.spotify.com/v1',
    url: `/users/${request.params.id}/playlists`, // id is user's Spotify ID
    headers: {
      'Authorization': 'Bearer ' + request.query.access_token,
      'Content-Type': 'application/json'
    }
  };
  axios(config).then(result => {
    console.log('LOOK AT YOUR PLAYLISTS: ', result.data);
    response.status(200).send(result.data);
  });
});


app.listen(PORT, () => console.log(`listening on ${PORT}`));
