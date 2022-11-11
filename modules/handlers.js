'use strict';

// const Playlist = require('../models/playlist');
const axios = require('axios');
const Handlers = {};

Handlers.getKeyword = async (req, res, next) => {
  const { searchQuery } = req.searchQuery.searchQuery;
  const url = `https://api.spotify.com/v1/search?q=${searchQuery}&type=track&limit=6&market=ES`;
  axios
    .get(url)
    .then(playlist => {
      console.log(playlist.data);
      const tracksArray = playlist.data.items.map(tracks => new Playlist(tracks));
      res.status(200).send(tracksArray);
    })
    .catch(error => {
      console.error(error);
      next(error);
    });
};

Handlers.getGenre = async (req, res, next) => {
  const { searchGenre } = req.query.searchGenre;
  const url = `https://api.spotify.com/v1/search?genre=${searchGenre}&type=track&limit=6&market=ES`;
  axios
    .get(url)
    .then(playlist => {
      console.log(playlist.data);
      const tracksArray = playlist.data.items.map(tracks => new Playlist(tracks));
      res.status(200).send(tracksArray);
    })
    .catch(error => {
      console.error(error);
      next(error);
    });
};

// class Playlist {
//   constructor(tracks) {
//     this.items = tracks.
//   }
// }

module.exports = Handlers;
