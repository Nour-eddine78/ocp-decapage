const express = require('express');
const router = express.Router();
const {
  createMachine,
  updateMachine,
  getAllMachines,
  getMachineById,
  deleteMachine,
  getMachinesCount
} = require('../controllers/machineController');
const { protect } = require('../middleware/authMiddleware');

// Protected routes
router.use(protect);
router.route('/')
  .get( getAllMachines)
  .post( createMachine);
router.route('/count')
  .get( getMachinesCount);

router.route('/:id')
  .get( getMachineById)
  .put( updateMachine)
  .delete( deleteMachine);

module.exports = router;