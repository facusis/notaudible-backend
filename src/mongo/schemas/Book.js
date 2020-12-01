const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  title: String,
  author: String,
  category: String,
  user: String,
  sinopsis: String,
});

const Book = mongoose.model('Book', schema);

module.exports = Book;