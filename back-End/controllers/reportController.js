
const mongoose = require('mongoose');
const Report = require('../models/Report');
const User = require('../models/User');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const { ObjectId } = mongoose.Types;

// Ensure upload directory exists
const uploadDir = path.join(__dirname, '..', 'Uploads', 'report');
const ensureUploadDir = async () => {
  try {
    await fs.mkdir(uploadDir, { recursive: true });
    await fs.chmod(uploadDir, 0o755); // Ensure writable
    console.log(`Upload directory ensured: ${uploadDir}`);
  } catch (err) {
    console.error('Error creating upload directory:', err);
    throw new Error(`Failed to create upload directory: ${err.message}`);
  }
};

// Set up Multer for report file storage
const uploadReport = multer({
  storage: multer.diskStorage({
    destination: async (req, file, cb) => {
      try {
        await ensureUploadDir();
        cb(null, uploadDir);
      } catch (err) {
        console.error('Multer destination error:', err);
        cb(err);
      }
    },
    filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
  }),
  fileFilter: (req, file, cb) => {
    const filetypes = /pdf/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) return cb(null, true);
    cb(new Error('Only PDF files are allowed'));
  },
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
}).single('pdf');

// File upload
const uploadReportFile = async (req, res) => {
  try {
    await ensureUploadDir(); // Ensure directory exists before Multer runs
    uploadReport(req, res, async (err) => {
      try {
        if (err) {
          console.error('Multer error:', err.message);
          return res.status(400).json({ success: false, message: err.message });
        }
        if (!req.file) {
          return res.status(400).json({ success: false, message: 'No file uploaded' });
        }
        const filePath = `/Uploads/report/${req.file.filename}`;
        res.status(200).json({ success: true, data: { filePath }, message: 'File uploaded successfully' });
      } catch (error) {
        console.error('Error uploading report file:', error);
        res.status(500).json({ success: false, message: 'Failed to upload file', error: error.message });
      }
    });
  } catch (error) {
    console.error('Upload directory error:', error);
    res.status(500).json({ success: false, message: 'Failed to initialize upload directory', error: error.message });
  }
};

// Serve a report file
const serveReportFile = async (req, res) => {
  try {
    const filename = req.params.filename;
    const filePath = path.join(uploadDir, filename);
    
    // Check if file exists
    try {
      await fs.access(filePath);
    } catch (err) {
      console.error(`File not found: ${filePath}`, err);
      return res.status(404).json({ success: false, message: 'File not found' });
    }

    res.sendFile(filePath, (err) => {
      if (err) {
        console.error('Error serving file:', err);
        res.status(500).json({ success: false, message: 'Failed to serve file' });
      }
    });
  } catch (error) {
    console.error('Error serving report file:', error);
    res.status(500).json({ success: false, message: 'Failed to serve file', error: error.message });
  }
};

// Validation helper
const validateReportType = (type) => {
  const validTypes = ['Daily', 'Weekly', 'Monthly', 'Custom'];
  return validTypes.includes(type);
};

// Create a new Report
const createReport = async (req, res) => {
  try {
    const { type, period, userId, filters, filePath } = req.body;

    // Validate required fields
    if (!type || !period || !userId || !filePath) {
      return res.status(400).json({
        success: false,
        message: 'Type, period, user, and filePath are required',
      });
    }

    // Validate IDs
    if (!ObjectId.isValid(userId)) {
      return res.status(400).json({ success: false, message: 'Invalid user ID' });
    }

    // Validate report type
    if (!validateReportType(type)) {
      return res.status(400).json({ success: false, message: 'Invalid report type' });
    }

    // Validate period
    if (!period.startDate || !period.endDate) {
      return res.status(400).json({ success: false, message: 'Period must include startDate and endDate' });
    }

    // Validate user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ success: false, message: 'User not found' });
    }

    // Validate file exists
    try {
      await fs.access(path.join(__dirname, '..', filePath));
    } catch (err) {
      console.error(`File validation failed for ${filePath}:`, err);
      return res.status(400).json({ success: false, message: `File not found: ${filePath}` });
    }

    const report = new Report({
      type,
      period,
      generatedBy: userId,
      filters: filters || {},
      filePath,
    });

    const savedReport = await report.save();
    const populatedReport = await Report.findById(savedReport._id).populate('generatedBy', '_id name email');

    res.status(201).json({
      success: true,
      data: populatedReport,
      message: 'Report created successfully',
    });
  } catch (error) {
    console.error('Error creating report:', error);
    res.status(400).json({
      success: false,
      message: 'Failed to create report',
      error: error.message,
    });
  }
};

// Update a Report
const updateReport = async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid report ID' });
    }

    const report = await Report.findById(req.params.id);
    if (!report) {
      return res.status(404).json({ success: false, message: 'Report not found' });
    }

    const { type, period, userId, filters, filePath } = req.body;

    // Update fields if provided
    if (type) {
      if (!validateReportType(type)) {
        return res.status(400).json({ success: false, message: 'Invalid report type' });
      }
      report.type = type;
    }
    if (period) {
      if (!period.startDate || !period.endDate) {
        return res.status(400).json({ success: false, message: 'Period must include startDate and endDate' });
      }
      report.period = period;
    }
    if (userId) {
      if (!ObjectId.isValid(userId)) {
        return res.status(400).json({ success: false, message: 'Invalid user ID' });
      }
      const user = await User.findById(userId);
      if (!user) {
        return res.status(400).json({ success: false, message: 'User not found' });
      }
      report.generatedBy = userId;
    }
    if (filters) report.filters = filters;
    if (filePath) {
      // Validate new file exists
      try {
        await fs.access(path.join(__dirname, '..', filePath));
      } catch (err) {
        console.error(`File validation failed for ${filePath}:`, err);
        return res.status(400).json({ success: false, message: `File not found: ${filePath}` });
      }
      // Delete old file if it exists
      if (report.filePath && report.filePath !== filePath) {
        try {
          await fs.unlink(path.join(__dirname, '..', report.filePath));
        } catch (err) {
          console.warn('Failed to delete old report file:', err.message);
        }
      }
      report.filePath = filePath;
    }

    const updatedReport = await report.save();
    const populatedReport = await Report.findById(updatedReport._id).populate('generatedBy', '_id name email');

    res.status(200).json({
      success: true,
      data: populatedReport,
      message: 'Report updated successfully',
    });
  } catch (error) {
    console.error('Error updating report:', error);
    res.status(400).json({
      success: false,
      message: 'Failed to update report',
      error: error.message,
    });
  }
};

// Get all Reports
const getAllReports = async (req, res) => {
  try {
    const reports = await Report.find().populate('generatedBy', '_id name email');

    res.status(200).json({
      success: true,
      data: reports,
      message: 'Reports retrieved successfully',
    });
  } catch (error) {
    console.error('Error fetching reports:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch reports',
      error: error.message,
    });
  }
};

// Get a single Report by ID
const getReportById = async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid report ID' });
    }
    const report = await Report.findById(req.params.id).populate('generatedBy', '_id name email');
    if (!report) {
      return res.status(404).json({ success: false, message: 'Report not found' });
    }
    res.status(200).json({
      success: true,
      data: report,
      message: 'Report retrieved successfully',
    });
  } catch (error) {
    console.error('Error fetching report:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch report',
      error: error.message,
    });
  }
};

// Delete a Report
const deleteReport = async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid report ID' });
    }
    const report = await Report.findById(req.params.id);
    if (!report) {
      return res.status(404).json({ success: false, message: 'Report not found' });
    }

    // Delete the file
    if (report.filePath) {
      try {
        await fs.unlink(path.join(__dirname, '..', report.filePath));
      } catch (err) {
        console.warn('Failed to delete report file:', err.message);
      }
    }

    await report.deleteOne();
    res.status(200).json({
      success: true,
      message: 'Report deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting report:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete report',
      error: error.message,
    });
  }
};

// Get Reports Count
const getReportsCount = async (req, res) => {
  try {
    const count = await Report.countDocuments();
    res.status(200).json({
      success: true,
      data: { count },
      message: 'Reports count retrieved successfully',
    });
  } catch (error) {
    console.error('Error fetching reports count:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch reports count',
      error: error.message,
    });
  }
};

module.exports = {
  createReport,
  updateReport,
  getAllReports,
  getReportById,
  deleteReport,
  getReportsCount,
  uploadReportFile,
  serveReportFile,
};