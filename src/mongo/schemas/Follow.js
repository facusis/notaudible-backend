const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
  follower: {
    type: Schema.Types.ObjectId,
    ref: 'User' 
  },
  following: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
},
);
const Follow = mongoose.model('Follows', schema);

module.exports = Follow;