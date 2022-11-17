'use strict';

require('dotenv').config();

const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_DATABASE, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function () { console.log('It worked! Mongoose is connected'); });

const Playlist = require('../model/playlist');

async function seed() {
  console.log('Seeding database...');
  console.log(Playlist);
  await Playlist.create({
    user_id: '12345',
    email: 'camilla.c.rees@gmail.com',
    name: 'Camilla\'s Playlist',
    notes: ['note1', 'note2', 'note3'],
    body: {
      items: [{
        artist: 'me',
        trackName: 'pop song'
      }],
      limit: 12,
    },
    playlist_id: '12345',
    uri: 'spotify:album:1TIUsv8qmYLpBEhvmBmyBk'
  });

  await Playlist.create({
    user_id: '000000',
    email: 'camilla.c.rees@gmail.com',
    name: 'Ezgi\'s Playlist',
    notes: ['note1', 'note2', 'note3'],
    body: {
      items: [{
        artist: 'me',
        trackName: 'pop song'
      }],
      limit: 12,
    },
    playlist_id: '12345',
    uri: 'spotify:album:1TIUsv8qmYLpBEhvmBmyBk'
  });

  await Playlist.create({
    user_id: '56789',
    email: 'camilla.c.rees@gmail.com',
    name: 'Our Playlist',
    notes: ['note1', 'note2', 'note3'],
    body: {
      items: [{
        artist: 'me',
        trackName: 'pop song'
      }],
      limit: 12,
    },
    playlist_id: '12345',
    uri: 'spotify:album:1TIUsv8qmYLpBEhvmBmyBk'
  });

  await Playlist.create({
    keyword: ['happy' , 'party', 'fun'],
    genre: 'pop',
    uri: 'spotify:album:1TIUsv8qmYLpBEhvmBmyBk'
  });

  await Playlist.create({
    keyword: ['sad' , 'chill', 'idk'],
    genre: 'rock',
    uri: 'spotify:album:27ftYHLeunzcSzb33Wk1h'
  });

  await Playlist.create({
    keyword: ['dance' , 'rock-out', 'idk'],
    genre: 'rock',
    uri: 'spotify:album:27ftYHLeunzcSzb33Wk1hf'
  });

  mongoose.disconnect();
}

seed();
