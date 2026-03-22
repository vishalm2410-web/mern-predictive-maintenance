const express = require('express');
const router = express.Router();

// Import in-memory data from server.js
let equipmentData;
let alertsData;
let maintenanceData;

// Function to set data reference (called from server.js)
function setDataRefs(equipment, alerts, maintenance) {
  equipmentData = equipment;
  alertsData = alerts;
  maintenanceData = maintenance;
}

module.exports.setDataRefs = setDataRefs;

// ============================================
// GET ALL MAINTENANCE RECORDS
// ============================================
router.get('/', async (req, res) => {
  try {
    res.json(maintenanceData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// GET MAINTENANCE BY ID
// ============================================
router.get('/:id', async (req, res) => {
  try {
    const maintenance = maintenanceData.find(m => m._id === req.params.id || m.id === req.params.id);
    if (!maintenance) {
      return res.status(404).json({ error: 'Maintenance record not found' });
    }
    res.json(maintenance);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// CREATE MAINTENANCE RECORD
// ============================================
router.post('/', async (req, res) => {
  try {
    const { date, equipment, type, status, duration, cost, description } = req.body;

    if (!date || !equipment || !type || !status || !duration || cost === undefined) {
      return res.status(400).json({ error: 'All required fields must be provided' });
    }

    const newMaintenance = {
      _id: Date.now().toString(),
      date,
      equipment,
      type,
      status,
      duration,
      cost,
      description: description || ''
    };

    maintenanceData.push(newMaintenance);
    res.status(201).json(newMaintenance);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// UPDATE MAINTENANCE RECORD
// ============================================
router.put('/:id', async (req, res) => {
  try {
    const { date, equipment, type, status, duration, cost, description } = req.body;
    const maintenanceIndex = maintenanceData.findIndex(m => m._id === req.params.id || m.id === req.params.id);

    if (maintenanceIndex === -1) {
      return res.status(404).json({ error: 'Maintenance record not found' });
    }

    maintenanceData[maintenanceIndex] = {
      ...maintenanceData[maintenanceIndex],
      date,
      equipment,
      type,
      status,
      duration,
      cost,
      description
    };

    res.json(maintenanceData[maintenanceIndex]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// DELETE MAINTENANCE RECORD
// ============================================
router.delete('/:id', async (req, res) => {
  try {
    const maintenanceIndex = maintenanceData.findIndex(m => m._id === req.params.id || m.id === req.params.id);
    if (maintenanceIndex === -1) {
      return res.status(404).json({ error: 'Maintenance record not found' });
    }

    const deletedMaintenance = maintenanceData.splice(maintenanceIndex, 1)[0];
    res.json({ message: 'Maintenance record deleted successfully', maintenance: deletedMaintenance });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// GET MAINTENANCE BY EQUIPMENT
// ============================================
router.get('/equipment/:equipmentId', async (req, res) => {
  try {
    const equipmentMaintenance = maintenanceData.filter(m => m.equipment === req.params.equipmentId);
    res.json(equipmentMaintenance);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// GET MAINTENANCE BY STATUS
// ============================================
router.get('/status/:status', async (req, res) => {
  try {
    const statusMaintenance = maintenanceData.filter(m => m.status === req.params.status);
    res.json(statusMaintenance);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
module.exports.setDataRefs = setDataRefs;
