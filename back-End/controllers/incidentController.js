const mongoose = require('mongoose');
const Incident = require('../models/Incident');
const User = require('../models/User');
const Machine = require('../models/Machine');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const { ObjectId } = mongoose.Types;

// Set up Multer for incident file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'Uploads/incidents/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|pdf/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Seuls les fichiers JPEG, JPG, PNG ou PDF sont autorisés'));
  },
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
}).fields([{ name: 'attachments', maxCount: 5 }]);

// Create a new Incident
const createIncident = async (req, res) => {
  upload(req, res, async (err) => {
    try {
      if (err) {
        return res.status(400).json({
          success: false,
          message: err.message || 'Erreur lors du téléchargement des fichiers',
        });
      }

      const {
        incidentDateTime,
        zone,
        niveau,
        machine,
        severityLevel,
        description,
        declarant,
        operationStopped,
        zoneSecured,
        injuries,
        injuredNames,
        injuryTypes,
        injuryTimes,
        status,
      } = req.body;

      // Validate required fields
      if (!incidentDateTime || !severityLevel || !status) {
        return res.status(400).json({
          success: false,
          message: 'La date de l\'incident, le niveau de gravité et le statut sont requis',
        });
      }

      // Validate IDs
      if (machine && !ObjectId.isValid(machine)) {
        return res.status(400).json({ success: false, message: 'ID de machine invalide' });
      }
      if (declarant && !ObjectId.isValid(declarant)) {
        return res.status(400).json({ success: false, message: 'ID de déclarant invalide' });
      }

      // Validate declarant exists
      if (declarant) {
        const user = await User.findById(declarant);
        if (!user) {
          return res.status(400).json({ success: false, message: 'Déclarant non trouvé' });
        }
      }

      // Validate machine exists
      if (machine) {
        const machineExists = await Machine.findById(machine);
        if (!machineExists) {
          return res.status(400).json({ success: false, message: 'Machine non trouvée' });
        }
      }

      const attachments = req.files?.attachments
        ? req.files.attachments.map((file) => `/Uploads/incidents/${file.filename}`)
        : [];

      const incident = new Incident({
        incidentDateTime,
        zone: zone || null,
        niveau: niveau || null,
        machine: machine || null,
        severityLevel,
        description,
        declarant: declarant || null,
        attachments,
        operationStopped: operationStopped === 'true' || operationStopped === true,
        zoneSecured: zoneSecured === 'true' || zoneSecured === true,
        injuries: injuries === 'true' || injuries === true,
        injuredNames: injuredNames ? (Array.isArray(injuredNames) ? injuredNames : injuredNames.split(',').map(item => item.trim())) : [],
        injuryTypes: injuryTypes ? (Array.isArray(injuryTypes) ? injuryTypes : injuryTypes.split(',').map(item => item.trim())) : [],
        injuryTimes: injuryTimes ? (Array.isArray(injuryTimes) ? injuryTimes : injuryTimes.split(',').map(item => item.trim())) : [],
        status,
      });

      const savedIncident = await incident.save();
      const populatedIncident = await Incident.findById(savedIncident._id)
        .populate('machine', '_id name')
        .populate('declarant', '_id name email');

      res.status(201).json({
        success: true,
        data: populatedIncident,
        message: 'Incident créé avec succès',
      });
    } catch (error) {
      console.error('Erreur lors de la création de l\'incident:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Échec de la création de l\'incident',
      });
    }
  });
};

// Update an Incident
const updateIncident = async (req, res) => {
  upload(req, res, async (err) => {
    try {
      if (err) {
        return res.status(400).json({
          success: false,
          message: err.message || 'Erreur lors du téléchargement des fichiers',
        });
      }

      if (!ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ success: false, message: 'ID d\'incident invalide' });
      }

      const incident = await Incident.findById(req.params.id);
      if (!incident) {
        return res.status(404).json({ success: false, message: 'Incident non trouvé' });
      }

      const {
        incidentDateTime,
        zone,
        niveau,
        machine,
        severityLevel,
        description,
        declarant,
        operationStopped,
        zoneSecured,
        injuries,
        injuredNames,
        injuryTypes,
        injuryTimes,
        status,
      } = req.body;

      // Update fields if provided
      if (incidentDateTime) incident.incidentDateTime = incidentDateTime;
      if (zone !== undefined) incident.zone = zone || null;
      if (niveau !== undefined) incident.niveau = niveau || null;
      if (machine) {
        if (!ObjectId.isValid(machine)) {
          return res.status(400).json({ success: false, message: 'ID de machine invalide' });
        }
        const machineExists = await Machine.findById(machine);
        if (!machineExists) {
          return res.status(400).json({ success: false, message: 'Machine non trouvée' });
        }
        incident.machine = machine;
      }
      if (severityLevel) {
        incident.severityLevel = severityLevel;
      }
      if (description !== undefined) incident.description = description;
      if (declarant) {
        if (!ObjectId.isValid(declarant)) {
          return res.status(400).json({ success: false, message: 'ID de déclarant invalide' });
        }
        const user = await User.findById(declarant);
        if (!user) {
          return res.status(400).json({ success: false, message: 'Déclarant non trouvé' });
        }
        incident.declarant = declarant;
      }
      if (req.files?.attachments) {
        const newAttachments = req.files.attachments.map(file => `/Uploads/incidents/${file.filename}`);
        incident.attachments = [...incident.attachments, ...newAttachments];
      }
      if (operationStopped !== undefined) {
        incident.operationStopped = operationStopped === 'true' || operationStopped === true;
      }
      if (zoneSecured !== undefined) {
        incident.zoneSecured = zoneSecured === 'true' || zoneSecured === true;
      }
      if (injuries !== undefined) {
        incident.injuries = injuries === 'true' || injuries === true;
      }
      if (injuredNames) {
        incident.injuredNames = Array.isArray(injuredNames) ? injuredNames : injuredNames.split(',').map(item => item.trim());
      }
      if (injuryTypes) {
        incident.injuryTypes = Array.isArray(injuryTypes) ? injuryTypes : injuryTypes.split(',').map(item => item.trim());
      }
      if (injuryTimes) {
        incident.injuryTimes = Array.isArray(injuryTimes) ? injuryTimes : injuryTimes.split(',').map(item => new Date(item.trim()));
      }
      if (status) {
        incident.status = status;
      }

      const updatedIncident = await incident.save();
      const populatedIncident = await Incident.findById(updatedIncident._id)
        .populate('machine', '_id name')
        .populate('declarant', '_id name email');

      res.status(200).json({
        success: true,
        data: populatedIncident,
        message: 'Incident mis à jour avec succès',
      });
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'incident:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Échec de la mise à jour de l\'incident',
      });
    }
  });
};

// Get all Incidents
const getAllIncidents = async (req, res) => {
  try {
    const incidents = await Incident.find()
      .populate('machine', '_id name')
      .populate('declarant', '_id name email');

    res.status(200).json({
      success: true,
      data: incidents,
      message: 'Incidents récupérés avec succès',
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des incidents:', error);
    res.status(500).json({
      success: false,
      message: 'Échec de la récupération des incidents',
      error: error.message,
    });
  }
};

// Get a single Incident by ID
const getIncidentById = async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: 'ID d\'incident invalide' });
    }
    const incident = await Incident.findById(req.params.id)
      .populate('machine', '_id name')
      .populate('declarant', '_id name email');
    if (!incident) {
      return res.status(404).json({ success: false, message: 'Incident non trouvé' });
    }
    res.status(200).json({
      success: true,
      data: incident,
      message: 'Incident récupéré avec succès',
    });
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'incident:', error);
    res.status(500).json({
      success: false,
      message: 'Échec de la récupération de l\'incident',
      error: error.message,
    });
  }
};

// Delete an Incident
const deleteIncident = async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: 'ID d\'incident invalide' });
    }
    const incident = await Incident.findById(req.params.id);
    if (!incident) {
      return res.status(404).json({ success: false, message: 'Incident non trouvé' });
    }

    // Delete associated attachments
    if (incident.attachments && incident.attachments.length > 0) {
      for (const attachment of incident.attachments) {
        try {
          await fs.unlink(path.join(__dirname, '..', attachment));
        } catch (err) {
          console.warn('Échec de la suppression de la pièce jointe:', err.message);
        }
      }
    }

    await incident.deleteOne();
    res.status(200).json({
      success: true,
      message: 'Incident supprimé avec succès',
    });
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'incident:', error);
    res.status(500).json({
      success: false,
      message: 'Échec de la suppression de l\'incident',
      error: error.message,
    });
  }
};

// Get Incidents Count
const getIncidentsCount = async (req, res) => {
  try {
    const count = await Incident.countDocuments();
    res.status(200).json({
      success: true,
      data: { count },
      message: 'Nombre d\'incidents récupéré avec succès',
    });
  } catch (error) {
    console.error('Erreur lors de la récupération du nombre d\'incidents:', error);
    res.status(500).json({
      success: false,
      message: 'Échec de la récupération du nombre d\'incidents',
      error: error.message,
    });
  }
};

// Get Recent Incidents
const getRecentIncidents = async (req, res) => {
  try {
    const incidents = await Incident.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('description severityLevel status createdAt')
      .lean();

    const formattedIncidents = incidents.map((incident) => ({
      title: incident.description || 'Incident signalé',
      severity: incident.severityLevel,
      status: incident.status.toLowerCase().replace(' ', '-'),
      createdAt: incident.createdAt,
    }));

    res.status(200).json({
      success: true,
      data: formattedIncidents,
      message: 'Incidents récents récupérés avec succès',
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des incidents récents:', error);
    res.status(500).json({
      success: false,
      message: 'Échec de la récupération des incidents récents',
      error: error.message,
    });
  }
};

module.exports = {
  createIncident,
  updateIncident,
  getAllIncidents,
  getIncidentById,
  deleteIncident,
  getIncidentsCount,
  getRecentIncidents,
};