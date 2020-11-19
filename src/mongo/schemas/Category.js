const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    title: String,
    description: String,

});

const Category = mongoose.model('Category', schema);

module.exports = Category;