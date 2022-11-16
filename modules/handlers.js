'use strict';

// const Playlist = require('../model/playlist');
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
    const playlists = await dummyPlaylist.find({});
    res.status(200).send(playlists);
  } catch(error) {
    console.error(error);
    next(error);
  }
};

Handlers.searchPlaylist = async (req, res, next) => {
  try {
    const searchPlaylists = await dummyPlaylist.find({});
    res.status(200).send(searchPlaylists);
  } catch(error) {
    console.error(error);
    next(error);
  }
};


Handlers.savePlaylist = async (req, res, next) => {
  try {
    // if I pass in an empty object, that tells Mongoose to get ALL the documents from the database
    const savedPlaylist = await dummyPlaylist.create(req.body);
    res.status(201).send(savedPlaylist);
  } catch(error) {
    error.customMessage = 'Something went wrong when creating your playlist';
    console.error(error.customMessage + error);
    next(error);
  }
};


Handlers.deleteSavedPlaylist = async (request, response, next) => {
  const { id } = request.params;
  try {
    const playlist = await dummyPlaylist.findOne({ _id: id });
    if (!playlist) response.status(400).send('unable to delete playlist');
    else {
      await dummyPlaylist.findByIdAndDelete(id);
      response.status(204).send('your playlist is deleted!');
    }
  } catch(error) {
    error.customMessage = 'Something went wrong when deleting your playlist: ';
    console.error(error.customMessage + error);
    next(error);
  }
};
Handlers.updateNote = async (request, response, next) => {
  const { id } = request.params;
  try {
    // Model.findByIdAndUpdate(id, updatedData, options)
    const playlist = await dummyPlaylist.findOne({ _id: id});
    if (!playlist) response.status(400).send('unable to update playlist');
    else{
      const updatedPlaylist = await dummyPlaylist.findByIdAndUpdate(id, request.body, { new: true, overwrite: false });
      response.status(200).send(updatedPlaylist);
    }
  } catch(error) {
    error.customMessage = 'Something went wrong when updating your playlist: ';
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
