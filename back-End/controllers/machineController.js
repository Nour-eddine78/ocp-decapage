const mongoose = require('mongoose');
const Machine = require('../models/Machine');
const User = require('../models/User');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const { ObjectId } = mongoose.Types;

// Set up Multer for machine file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'Uploads/machine/'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|pdf/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) return cb(null, true);
    cb(new Error('Only JPEG, JPG, PNG, or PDF files are allowed'));
  },
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
}).fields([{ name: 'image', maxCount: 1 }, { name: 'pdf', maxCount: 1 }]);

// Validation helpers
const validateMethod = (method) => ['Poussage', 'Casement', 'Transport'].includes(method);

const validateName = (name) => typeof name === 'string' && name.trim().length >= 3 && name.trim().length <= 100;

const validateAddedBy = async (id) => {
  if (!id) return { valid: false, error: 'No user ID provided' };
  if (!ObjectId.isValid(id)) return { valid: false, error: `Invalid ObjectId format: ${id}` };
  const user = await User.findById(id).select('_id name email role');
  if (!user) return { valid: false, error: `User not found for ID: ${id}` };
  return { valid: true, user };
};

// Create a new Machine
const createMachine = async (req, res) => {
  upload(req, res, async (err) => {
    try {
      if (err) {
        return res.status(400).json({ success: false, message: err.message || 'Error uploading files' });
      }

      const { name, method, description } = req.body;
      const addedBy = req.user?.id; // From protect middleware
      console.log('Creating machine with addedBy:', addedBy); // Debug log

      // Validate inputs
      if (!name || !method) {
        return res.status(400).json({ success: false, message: 'Name and method are required' });
      }

      if (!validateName(name)) {
        return res.status(400).json({ success: false, message: 'Name must be between 3 and 100 characters' });
      }

      if (!validateMethod(method)) {
        return res.status(400).json({ success: false, message: 'Invalid method. Must be one of: Poussage, Casement, Transport' });
      }

      // Check for unique name
      const existingMachine = await Machine.findOne({ name: name.trim() });
      if (existingMachine) {
        return res.status(400).json({ success: false, message: 'Machine name already exists' });
      }

      // Validate addedBy
      const addedByResult = await validateAddedBy(addedBy);
      if (!addedByResult.valid) {
        return res.status(400).json({ success: false, message: addedByResult.error });
      }

      const machineData = {
        name: name.trim(),
        method,
        description: description ? description.trim() : undefined,
        addedBy,
        addedByModel: 'User',
      };

      if (req.files?.image) machineData.image = `/Uploads/machine/${req.files.image[0].filename}`;
      if (req.files?.pdf) machineData.pdf = `/Uploads/machine/${req.files.pdf[0].filename}`;

      const machine = new Machine(machineData);
      try {
        await machine.save();
      } catch (error) {
        // Clean up uploaded files if save fails
        if (req.files?.image) {
          try { await fs.unlink(path.join(__dirname, '..', machineData.image)); } catch (err) { console.warn('Failed to clean up image:', err.message); }
        }
        if (req.files?.pdf) {
          try { await fs.unlink(path.join(__dirname, '..', machineData.pdf)); } catch (err) { console.warn('Failed to clean up PDF:', err.message); }
        }
        throw error;
      }

      const populatedMachine = await Machine.findById(machine._id).populate('addedBy', '_id name email role');

      res.status(201).json({ success: true, data: populatedMachine, message: 'Machine created successfully' });
    } catch (error) {
      console.error('Create machine error:', error);
      res.status(500).json({ success: false, message: 'Failed to create machine', error: error.message });
    }
  });
};

// Update a Machine
const updateMachine = async (req, res) => {
  upload(req, res, async (err) => {
    try {
      if (err) {
        return res.status(400).json({ success: false, message: err.message || 'Error uploading files' });
      }

      if (!ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ success: false, message: 'Invalid machine ID' });
      }

      const machine = await Machine.findById(req.params.id);
      if (!machine) {
        return res.status(404).json({ success: false, message: 'Machine not found' });
      }

      const { name, method, description } = req.body;
      const addedBy = req.user?.id; // From protect middleware
      console.log('Updating machine with addedBy:', addedBy); // Debug log

      // Store old file paths for deletion
      const oldImage = machine.image;
      const oldPDF = machine.pdf;

      if (name) {
        if (!validateName(name)) {
          return res.status(400).json({ success: false, message: 'Name must be between 3 and 100 characters' });
        }
        const existingMachine = await Machine.findOne({ name: name.trim(), _id: { $ne: machine._id } });
        if (existingMachine) {
          return res.status(400).json({ success: false, message: 'Machine name already exists' });
        }
        machine.name = name.trim();
      }

      if (method) {
        if (!validateMethod(method)) {
          return res.status(400).json({ success: false, message: 'Invalid method. Must be one of: Poussage, Casement, Transport' });
        }
        machine.method = method;
      }

      if (description !== undefined) machine.description = description.trim() || undefined;

      if (addedBy) {
        const addedByResult = await validateAddedBy(addedBy);
        if (!addedByResult.valid) {
          return res.status(400).json({ success: false, message: addedByResult.error });
        }
        machine.addedBy = addedBy;
        machine.addedByModel = 'User';
      }

      if (req.files?.image) machine.image = `/Uploads/machine/${req.files.image[0].filename}`;
      if (req.files?.pdf) machine.pdf = `/Uploads/machine/${req.files.pdf[0].filename}`;

      const updatedMachine = await machine.save();

      // Delete old files if replaced
      if (req.files?.image && oldImage) {
        try { await fs.unlink(path.join(__dirname, '..', oldImage)); } catch (err) { console.warn('Failed to delete old image:', err.message); }
      }
      if (req.files?.pdf && oldPDF) {
        try { await fs.unlink(path.join(__dirname, '..', oldPDF)); } catch (err) { console.warn('Failed to delete old PDF:', err.message); }
      }

      const populatedMachine = await Machine.findById(updatedMachine._id).populate('addedBy', '_id name email role');

      res.status(200).json({ success: true, data: populatedMachine, message: 'Machine updated successfully' });
    } catch (error) {
      console.error('Error updating machine:', error);
      res.status(400).json({ success: false, message: 'Failed to update machine', error: error.message });
    }
  });
};

// Get all Machines
const getAllMachines = async (req, res) => {
  try {
    const machines = await Machine.find().populate('addedBy', '_id name email role');
    res.status(200).json({ success: true, data: machines, message: 'Machines retrieved successfully' });
  } catch (error) {
    console.error('Error fetching machines:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch machines', error: error.message });
  }
};

// Get a single Machine by ID
const getMachineById = async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid machine ID' });
    }
  const machine = await Machine.findById(req.params.id).populate('addedBy', '_id name email role');
    if (!machine) {
      return res.status(404).json({ success: false, message: 'Machine not found' });
    }
  res.status(200).json({
      success: true,
      data: machine,
      message: 'Machine retrieved successfully',
    });
  } catch (error) {
    console.error('Error fetching machine:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch machine', error: error.message });
  }
};

// Delete a Machine
const deleteMachine = async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid machine ID' });
    }
    const machine = await Machine.findById(req.params.id);
    if (!machine) {
      return res.status(404).json({ success: false, message: 'Machine not found' });
    }
  

  // Delete associated files
    if (machine.image) {
      try {
        await fs.unlink(path.join(__dirname, '..', machine.image));
      } catch (err) {
        console.warn('Failed to delete image:', err.message);
      }
    }
    if (machine.pdf) {
      try {
        await fs.unlink(path.join(__dirname, '..', machine.pdf));
      } catch (err) {
        console.warn('Failed to delete PDF:', err.message);
      }
    }

    await machine.deleteOne();
    res.status(200).json({ success: true, message: 'Machine deleted successfully' });
  } catch (error) {
    console.error('Error deleting machine:', error);
    res.status(500).json({ success: false, message: 'Failed to delete machine', error: error.message });
  }
};

// Get Machines Count
const getMachinesCount = async (req, res) => {
  try {
    const count = await Machine.countDocuments();
    res.status(200).json({ success: true, data: { count }, message: 'Machines count retrieved successfully' });
  } catch (error) {
    console.error('Error fetching machines count:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch machines count', error: error.message });
  }
};

module.exports = {
  createMachine,
  updateMachine,
  getAllMachines,
  getMachineById,
  deleteMachine,
  getMachinesCount,
};