const mongoose = require('mongoose');

const operationSchema = new mongoose.Schema({
  ficheId: {
    type: String,
    required: true,
    trim: true,
    unique: true, // Enforce uniqueness at the schema level
  },
  interventionDateTime: {
    type: Date,
    required: true,
  },
  decapingMethod: {
    type: String,
    required: true,
    enum: ['Poussage', 'Casement', 'Transport'],
  },
  machine: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Machine', // Reference the Machine model
    required: true,
  },
  poste: {
    type: String,
    trim: true,
  },
  panneau: {
    type: String,
    trim: true,
  },
  tranche: {
    type: String,
    trim: true,
  },
  niveau: {
    type: String,
    trim: true,
  },
  machineState: {
    type: String,
    trim: true,
  },
  operatingHours: {
    type: Number,
    default: 0,
  },
  downtime: {
    type: Number,
    default: 0,
  },
  observations: {
    type: String,
    trim: true,
  },
  skippedVolume: {
    type: Number,
    default: 0,
  },
  profondeur: {
    type: Number,
    default: 0,
  },
  nombreTrous: {
    type: Number,
    default: 0,
  },
  longueur: {
    type: Number,
    default: 0,
  },
  largeur: {
    type: Number,
    default: 0,
  },
  metrics: {
    type: Object,
    default: {},
  },
}, { timestamps: true });

// Ensure unique index for ficheId
operationSchema.index({ ficheId: 1 }, { unique: true });

module.exports = mongoose.model('Operation', operationSchema);