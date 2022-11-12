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
    playlist_id: '12345'
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
    playlist_id: '12345'
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
    playlist_id: '12345'
  });
  mongoose.disconnect();
}

seed();

// async function clear() {
//   try {
//     await Book.deleteMany({});
//     console.log('Books cleared');
//   } catch (err) {
//     console.error(err);
//   } finally {
//     mongoose.disconnect();
//   }
// }
