'use strict';

const axios = require('axios');
const Playlist = require('../model/playlist');
const dummyPlaylist = require('../model/dummyplaylist');
const Handlers = {};

// Handlers.getKeyword = async (req, res, next) => {
//   const { searchQuery } = req.searchQuery.searchQuery;
//   const url = `https://api.spotify.com/v1/search?q=${searchQuery}&type=track&limit=6&market=ES`;
//   axios
//     .get(url)
//     .then(playlist => {
//       console.log(playlist.data);
//       const tracksArray = playlist.data.items.map(tracks => new Playlist(tracks));
//       res.status(200).send(tracksArray);
//     })
//     .catch(error => {
//       console.error(error);
//       next(error);
//     });
// };

// Handlers.getGenre = async (req, res, next) => {
//   const { searchGenre } = req.query.searchGenre;
//   const url = `https://api.spotify.com/v1/search?genre=${searchGenre}&type=track&limit=6&market=ES`;
//   axios
//     .get(url)
//     .then(playlist => {
//       console.log(playlist.data);
//       const tracksArray = playlist.data.items.map(tracks => new Playlist(tracks));
//       res.status(200).send(tracksArray);
//     })
//     .catch(error => {
//       console.error(error);
//       next(error);
//     });
// };

Handlers.getSavedPlaylist = async (req, res, next) => {
  try {
    const playlists = await Playlist.find({});
    res.status(200).send(playlists);
  } catch(error) {
    console.error(error);
    next(error);
  }
};

Handlers.searchPlaylist = async (req, res, next) => {
  try {
    const searchPlaylists = await Playlist.find({});
    res.status(200).send(searchPlaylists);
  } catch(error) {
    console.error(error);
    next(error);
  }
};


Handlers.savePlaylist = async (req, res, next) => {
  try {
    // if I pass in an empty object, that tells Mongoose to get ALL the documents from the database
    const savedPlaylist = await Playlist.create(req.body);
    res.status(201).send(savedPlaylist);
  } catch(error) {
    error.customMessage = 'Something went wrong when creating your book';
    console.error(error.customMessage + error);
    next(error);
  }
};
// class Playlist {
//   constructor(tracks) {
//     this.items = tracks.
//   }
// }

module.exports = Handlers;
