const mongoose = require('mongoose');
const Performance = require('../models/Performance');
const User = require('../models/User');
const Machine = require('../models/Machine');
const { ObjectId } = mongoose.Types;

// Create a new Performance
const createPerformance = async (req, res) => {
  try {
    const { machineId, date, metrics, operatorId } = req.body;

    // Validate required fields
    if (!machineId || !date) {
      return res.status(400).json({ success: false, message: 'Machine and date are required' });
    }

    // Validate IDs
    if (!ObjectId.isValid(machineId)) {
      return res.status(400).json({ success: false, message: 'Invalid machine ID' });
    }
    if (operatorId && !ObjectId.isValid(operatorId)) {
      return res.status(400).json({ success: false, message: 'Invalid operator ID' });
    }

    // Validate machine exists
    const machine = await Machine.findById(machineId);
    if (!machine) {
      return res.status(400).json({ success: false, message: 'Machine not found' });
    }

    // Validate operator exists
    if (operatorId) {
      const operator = await User.findById(operatorId);
      if (!operator) {
        return res.status(400).json({ success: false, message: 'Operator not found' });
      }
    }

    const performance = new Performance({
      machine: machineId,
      date,
      metrics: metrics || {},
      operator: operatorId || null,
    });

    const savedPerformance = await performance.save();
    const populatedPerformance = await Performance.findById(savedPerformance._id)
      .populate('machine', '_id name')
      .populate('operator', '_id name email');

    res.status(201).json({
      success: true,
      data: populatedPerformance,
      message: 'Performance created successfully',
    });
  } catch (error) {
    console.error('Error creating performance:', error);
    res.status(400).json({
      success: false,
      message: 'Failed to create performance',
      error: error.message,
    });
  }
};

// Update a Performance
const updatePerformance = async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid performance ID' });
    }

    const performance = await Performance.findById(req.params.id);
    if (!performance) {
      return res.status(404).json({ success: false, message: 'Performance not found' });
    }

    const { machineId, date, metrics, operatorId } = req.body;

    // Update fields if provided
    if (machineId) {
      if (!ObjectId.isValid(machineId)) {
        return res.status(400).json({ success: false, message: 'Invalid machine ID' });
      }
      const machine = await Machine.findById(machineId);
      if (!machine) {
        return res.status(400).json({ success: false, message: 'Machine not found' });
      }
      performance.machine = machineId;
    }
    if (date) performance.date = date;
    if (metrics) performance.metrics = metrics;
    if (operatorId) {
      if (!ObjectId.isValid(operatorId)) {
        return res.status(400).json({ success: false, message: 'Invalid operator ID' });
      }
      const operator = await User.findById(operatorId);
      if (!operator) {
        return res.status(400).json({ success: false, message: 'Operator not found' });
      }
      performance.operator = operatorId;
    }

    const updatedPerformance = await performance.save();
    const populatedPerformance = await Performance.findById(updatedPerformance._id)
      .populate('machine', '_id name')
      .populate('operator', '_id name email');

    res.status(200).json({
      success: true,
      data: populatedPerformance,
      message: 'Performance updated successfully',
    });
  } catch (error) {
    console.error('Error updating performance:', error);
    res.status(400).json({
      success: false,
      message: 'Failed to update performance',
      error: error.message,
    });
  }
};

// Get all Performances
const getAllPerformances = async (req, res) => {
  try {
    const performances = await Performance.find()
      .populate('machine', '_id name')
      .populate('operator', '_id name email');

    res.status(200).json({
      success: true,
      data: performances,
      message: 'Performances retrieved successfully',
    });
  } catch (error) {
    console.error('Error fetching performances:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch performances',
      error: error.message,
    });
  }
};

// Get a single Performance by ID
const getPerformanceById = async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid performance ID' });
    }
    const performance = await Performance.findById(req.params.id)
      .populate('machine', '_id name')
      .populate('operator', '_id name email');
    if (!performance) {
      return res.status(404).json({ success: false, message: 'Performance not found' });
    }
    res.status(200).json({
      success: true,
      data: performance,
      message: 'Performance retrieved successfully',
    });
  } catch (error) {
    console.error('Error fetching performance:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch performance',
      error: error.message,
    });
  }
};

// Delete a Performance
const deletePerformance = async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid performance ID' });
    }
    const performance = await Performance.findById(req.params.id);
    if (!performance) {
      return res.status(404).json({ success: false, message: 'Performance not found' });
    }
    await performance.deleteOne();
    res.status(200).json({
      success: true,
      message: 'Performance deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting performance:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete performance',
      error: error.message,
    });
  }
};

// Get Performance Score
const getPerformanceScore = async (req, res) => {
  try {
    const performances = await Performance.find().lean();
    const score = performances.length ? Math.round((performances.length / 100) * 75) : 0;
    res.status(200).json({
      success: true,
      data: { score },
      message: 'Performance score retrieved successfully',
    });
  } catch (error) {
    console.error('Error fetching performance score:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch performance score',
      error: error.message,
    });
  }
};

module.exports = {
  createPerformance,
  updatePerformance,
  getAllPerformances,
  getPerformanceById,
  deletePerformance,
  getPerformanceScore,
};