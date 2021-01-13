const mongoose = require('mongoose');
const passwordHash = require('password-hash');

const schema = new mongoose.Schema({
  follower: {type: mongoose.Schema.ObjectId, ref: 'User'},
  followed: {type: mongoose.Schema.ObjectId, ref: 'User'}
});

schema.pre('save', function() {
  this.password = passwordHash.generate(this.password)
});

const User = mongoose.model('Follow', schema);

module.exports = User;
