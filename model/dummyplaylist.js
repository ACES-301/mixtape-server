'use strict';

const mongoose = require('mongoose');

const { Schema } = mongoose;

const dummyPlaylistSchema = new Schema ({
  keyword: Array,
  genre: String,
  uri: String
});


const dummyPlaylist = mongoose.model('dummyPlaylist', dummyPlaylistSchema);

module.exports = dummyPlaylist;
