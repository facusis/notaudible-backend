const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  comment: String,
  creationDate: Date,
  bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book'},
});

const Comments = mongoose.model('Comments', schema);

module.exports = Comments;