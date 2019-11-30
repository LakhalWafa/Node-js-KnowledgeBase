const mongoose = require('mongoose');

//Article Schema
let arcticleSchema = mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  }
});

let Article = (module.exports = mongoose.model('Article', arcticleSchema));
