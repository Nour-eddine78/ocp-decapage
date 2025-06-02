const mongoose = require('mongoose');
const machineSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  method: { type: String, enum: ['Poussage', 'Casement', 'Transport'], required: true },
  description: { type: String },
  image: { type: String },
  pdf: { type: String },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'addedByModel',
    required: true,
  },
  addedByModel: {
    type: String,
    required: true,
    enum: ['User', 'Superadmin'],
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('Machine', machineSchema);