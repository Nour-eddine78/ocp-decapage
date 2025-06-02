const mongoose = require('mongoose');

const authSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  id_person: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  id_person_model: { type: String, required: true, enum: ['User'] },
});

module.exports = mongoose.model('Auth', authSchema);