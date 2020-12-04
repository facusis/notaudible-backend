const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  title: String,
  author: String,
  file: String,
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category'},
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User'}
});

const Book = mongoose.model('Book', schema);

module.exports = Book;