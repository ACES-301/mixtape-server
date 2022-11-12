'use strict';

const mongoose = require('mongoose');

const { Schema } = mongoose;

const playlistSchema = new Schema ({
  user_id: String,
  email: String,
  name: String,
  notes: Array,
  body: Object,
  playlist_id: String,
  uri: String
});


const Playlist = mongoose.model('Playlist', playlistSchema);

module.exports = Playlist;
