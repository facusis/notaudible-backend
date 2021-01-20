const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  comment: String,
  bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book'},
  createdAt: { type: Date, default: Date.now }
});

const Comments = mongoose.model('Comments', schema);

module.exports = Comments;