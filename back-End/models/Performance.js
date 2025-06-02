const mongoose = require('mongoose');

const performanceSchema = new mongoose.Schema({
  machine: { type: mongoose.Schema.Types.ObjectId, ref: 'Machine', required: true },
  date: { type: Date, required: true },
  availability: { type: Number }, // Percentage or ratio
  rendement: { type: Number }, // Yield or efficiency
  mtbf: { type: Number }, // Mean Time Between Failures
  operator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  zone: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Performance', performanceSchema);