const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  email: String,
  verifypassCode: String,
  createdAt: { type: Date, expires: '10m', default: Date.now }
});

const VerifyPassCode = mongoose.model('VerifyPassCode', schema);

module.exports = VerifyPassCode;
