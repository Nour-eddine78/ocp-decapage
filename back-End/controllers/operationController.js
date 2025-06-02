const mongoose = require('mongoose');
const Operation = require('../models/Operation');
const Machine = require('../models/Machine');
const { ObjectId } = mongoose.Types;

// Validation helper
const validateDecapingMethod = (method) => {
  const validMethods = ['Poussage', 'Casement', 'Transport'];
  return validMethods.includes(method);
};

// Create a new Operation
const createOperation = async (req, res) => {
  try {
    const {
      ficheId,
      interventionDateTime,
      decapingMethod,
      machineId,
      poste,
      panneau,
      tranche,
      niveau,
      machineState,
      operatingHours,
      downtime,
      observations,
      skippedVolume,
      profondeur,
      nombreTrous,
      longueur,
      largeur,
      metrics,
    } = req.body;

    // Validate required fields
    if (!ficheId || !interventionDateTime || !decapingMethod || !machineId) {
      return res.status(400).json({
        success: false,
        message: 'Fiche ID, intervention date-time, decaping method, and machine ID are required.',
      });
    }

    // Validate IDs
    if (!ObjectId.isValid(machineId)) {
      return res.status(400).json({ success: false, message: 'Invalid machine ID.' });
    }

    // Validate decaping method
    if (!validateDecapingMethod(decapingMethod)) {
      return res.status(400).json({ success: false, message: 'Invalid decaping method. Must be one of: Poussage, Casement, Transport.' });
    }

    // Validate machine exists and matches decaping method
    const machine = await Machine.findById(machineId);
    if (!machine) {
      return res.status(400).json({ success: false, message: 'Machine not found.' });
    }
    if (machine.method !== decapingMethod) {
      return res.status(400).json({
        success: false,
        message: `Machine ${machine.name} does not support decaping method ${machine.method}.`,
      });
    }

    // Check if ficheId already exists
    const existingOperation = await Operation.findOne({ ficheId });
    if (existingOperation) {
      return res.status(400).json({
        success: false,
        message: `Operation with ID ${ficheId} already exists.`,
      });
    }

    const operation = new Operation({
      ficheId,
      interventionDateTime,
      decapingMethod,
      machine: machineId,
      poste,
      panneau,
      tranche,
      niveau,
      machineState,
      operatingHours: parseFloat(operatingHours) || 0,
      downtime: parseFloat(downtime) || 0,
      observations,
      skippedVolume: parseFloat(skippedVolume) || 0,
      profondeur: parseFloat(profondeur) || 0,
      nombreTrous: parseInt(nombreTrous) || 0,
      longueur: parseFloat(longueur) || 0,
      largeur: parseFloat(largeur) || 0,
      metrics: metrics || {},
    });

    const savedOperation = await operation.save();
    const populatedOperation = await Operation.findById(savedOperation._id)
      .populate('machine', 'name _id method');

    res.status(201).json({
      success: true,
      data: populatedOperation,
      message: 'Operation created successfully.',
    });
  } catch (error) {
    console.error('Error creating operation:', error);
    if (error.code === 11000 && error.keyPattern.ficheId) {
      return res.status(400).json({
        success: false,
        message: `Operation with Fiche ID '${error.keyValue.ficheId}' already exists.`,
      });
    }
    res.status(500).json({
      success: false,
      message: 'Failed to create operation.',
      error: error.message,
    });
  }
};

// Update an Operation
const updateOperation = async (req, res) => {
  try {
    const operationId = req.params.id;
    if (!ObjectId.isValid(operationId)) {
      return res.status(400).json({ success: false, message: 'Invalid operation ID.' });
    }

    const operation = await Operation.findById(operationId);
    if (!operation) {
      return res.status(404).json({ success: false, message: 'Operation not found.' });
    }

    const {
      ficheId,
      interventionDateTime,
      decapingMethod,
      machineId,
      poste,
      panneau,
      tranche,
      niveau,
      machineState,
      operatingHours,
      downtime,
      observations,
      skippedVolume,
      profondeur,
      nombreTrous,
      longueur,
      largeur,
      metrics,
    } = req.body;

    // Validate fields if provided
    if (ficheId && ficheId !== operation.ficheId) {
      const existingOperation = await Operation.findOne({ ficheId: ficheId });
      if (existingOperation) {
        return res.status(400).json({
          success: false,
          message: `Operation with Fiche ID '${ficheId}' already exists.`,
        });
      }
      operation.ficheId = ficheId;
    }

    if (decapingMethod) {
      if (!validateDecapingMethod(decapingMethod)) {
        return res.status(400).json({ success: false, message: 'Invalid decaping method.' });
      }
      operation.decapingMethod = decapingMethod;
    }

    if (machineId) {
      if (!ObjectId.isValid(machineId)) {
        return res.status(400).json({ success: false, message: 'Invalid machine ID.' });
      }
      const machine = await Machine.findById(machineId);
      if (!machine) {
        return res.status(400).json({ success: false, message: 'Machine not found.' });
      }
      if (decapingMethod && machine.method !== decapingMethod) {
        return res.status(400).json({
          success: false,
          message: `Machine ${machine.name} does not support decaping method ${decapingMethod}.`,
        });
      }
      operation.machine = machineId;
    }

    if (interventionDateTime) operation.interventionDateTime = interventionDateTime;
    if (poste !== undefined) operation.poste = poste;
    if (panneau !== undefined) operation.panneau = panneau;
    if (tranche !== undefined) operation.tranche = tranche;
    if (niveau !== undefined) operation.niveau = niveau;
    if (machineState !== undefined) operation.machineState = machineState;
    if (operatingHours !== undefined) operation.operatingHours = parseFloat(operatingHours) || 0;
    if (downtime !== undefined) operation.downtime = parseFloat(downtime) || 0;
    if (observations !== undefined) operation.observations = observations;
    if (skippedVolume !== undefined) operation.skippedVolume = parseFloat(skippedVolume) || 0;
    if (profondeur !== undefined) operation.profondeur = parseFloat(profondeur) || 0;
    if (nombreTrous !== undefined) operation.nombreTrous = parseInt(nombreTrous) || 0;
    if (longueur !== undefined) operation.longueur = parseFloat(longueur) || 0;
    if (largeur !== undefined) operation.largeur = parseFloat(largeur) || 0;
    if (metrics) operation.metrics = metrics;

    const updatedOperation = await operation.save();
    const populatedOperation = await Operation.findById(updatedOperation._id)
      .populate('machine', 'name _id method');

    res.status(200).json({
      success: true,
      data: populatedOperation,
      message: 'Operation updated successfully.',
    });
  } catch (error) {
    console.error('Error updating operation:', error);
    if (error.code === 11000 && error.keyPattern.ficheId) {
      return res.status(400).json({
        success: false,
        message: `Operation with Fiche ID '${error.keyValue.ficheId}' already exists.`,
      });
    }
    res.status(500).json({
      success: false,
      message: 'Failed to update operation.',
      error: error.message,
    });
  }
};

// Get all Operations
const getAllOperations = async (req, res) => {
  try {
    const { ficheId } = req.query;
    const query = ficheId ? { ficheId } : {};
    const operations = await Operation.find(query)
      .populate('machine', 'name _id method')
      .lean();

    res.status(200).json({
      success: true,
      data: operations,
      message: 'Operations retrieved successfully.',
    });
  } catch (error) {
    console.error('Error fetching operations:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch operations.',
      error: error.message,
    });
  }
};

// Get a single Operation by ID
const getOperationById = async (req, res) => {
  try {
    const operationId = req.params.id;
    if (!ObjectId.isValid(operationId)) {
      return res.status(400).json({ success: false, message: 'Invalid operation ID.' });
    }
    const operation = await Operation.findById(operationId)
      .populate('machine', 'name _id method')
      .lean();
    if (!operation) {
      return res.status(404).json({ success: false, message: 'Operation not found.' });
    }
    res.status(200).json({
      success: true,
      data: operation,
      message: 'Operation retrieved successfully.',
    });
  } catch (error) {
    console.error('Error fetching operation:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch operation.',
      error: error.message,
    });
  }
};

// Delete an Operation
const deleteOperation = async (req, res) => {
  try {
    const operationId = req.params.id;
    if (!ObjectId.isValid(operationId)) {
      return res.status(400).json({ success: false, message: 'Invalid operation ID.' });
    }
    const operation = await Operation.findById(operationId);
    if (!operation) {
      return res.status(404).json({ success: false, message: 'Operation not found.' });
    }
    await operation.deleteOne();
    res.status(200).json({
      success: true,
      message: 'Operation deleted successfully.',
    });
  } catch (error) {
    console.error('Error deleting operation:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete operation.',
      error: error.message,
    });
  }
};

// Get Operations Count
const getOperationsCount = async (req, res) => {
  try {
    const count = await Operation.countDocuments();
    res.status(200).json({
      success: true,
      data: { count },
      message: 'Operations count retrieved successfully.',
    });
  } catch (error) {
    console.error('Error fetching operations count:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch operations count.',
      error: error.message,
    });
  }
};

module.exports = {
  createOperation,
  updateOperation,
  getAllOperations,
  getOperationById,
  deleteOperation,
  getOperationsCount,
};