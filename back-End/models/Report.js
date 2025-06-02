const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  type: { type: String, enum: ['Daily', 'Weekly', 'Monthly', 'Custom'], required: true },
  period: {
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true }
  },
  generatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  filters: { type: Object }, // Flexible object for storing report filters (e.g., machine, zone)
  filePath: { type: String, required: true }, // Path to generated report file
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Report', reportSchema);