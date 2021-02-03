const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book'},
});

const Favourite = mongoose.model('Favourite', schema);

module.exports = Favourite;


