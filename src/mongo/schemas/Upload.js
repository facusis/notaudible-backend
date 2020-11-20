const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    title: String,
    description: String,

});

const Upload = mongoose.model('Upload', schema);

module.exports = Upload;