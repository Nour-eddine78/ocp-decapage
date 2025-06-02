const mongoose = require('mongoose');

const incidentSchema = new mongoose.Schema({
  incidentDateTime: { type: Date, required: true },
  zone: { type: String },
  niveau: { type: String },
  machine: { type: mongoose.Schema.Types.ObjectId, ref: 'Machine' },
  severityLevel: { type: String, enum: ['Faible', 'Moyen', 'Élevé', 'Critique'], required: true },
  description: { type: String },
  declarant: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  attachments: [{ type: String }],
  operationStopped: { type: Boolean, default: false },
  zoneSecured: { type: Boolean, default: false },
  injuries: { type: Boolean, default: false },
  injuredNames: [{ type: String }],
  injuryTypes: [{ type: String }],
  injuryTimes: [{ type: Date }],
  status: { type: String, enum: ['Ouvert', 'En cours', 'Résolu', 'Fermé'], required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Incident', incidentSchema);