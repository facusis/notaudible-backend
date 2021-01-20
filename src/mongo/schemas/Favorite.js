
const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book' }

});

const Favorite = mongoose.model('Favorite', schema);

module.exports = Favorite;

