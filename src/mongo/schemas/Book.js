const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  title: {
        type: String,
        index: true
      },
  author: String,
  sinopsis: String,
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category'},
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  file: { type: mongoose.Schema.Types.ObjectId, ref: 'fs.files' },
  urlimage: String,
});

const Book = mongoose.model('Book', schema);

module.exports = Book;