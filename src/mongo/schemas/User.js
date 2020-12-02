const mongoose = require('mongoose');
const passwordHash = require('password-hash');

const schema = new mongoose.Schema({
  email: String,
  password: String,
  nickname: String,
  about: String,
});

schema.pre('save', function() {
  this.password = passwordHash.generate(this.password)
});

const User = mongoose.model('User', schema);

module.exports = User;
