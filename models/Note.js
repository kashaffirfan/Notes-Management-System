// models/Note.js
const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  title: String,
  content: String,
  tags: [String],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // reference to the User model
    required: true
  }
});

module.exports = mongoose.model("Note", noteSchema);
