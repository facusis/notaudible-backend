const mongoose = require('mongoose');
const Schema = mongoose.Schema;
 
const FollowSchema = new Schema({
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
 
module.exports = mongoose.model('Follow', FollowSchema);