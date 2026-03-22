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
// GET ALL EQUIPMENT
// ============================================
router.get('/', async (req, res) => {
  try {
    res.json(equipmentData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// GET EQUIPMENT BY ID
// ============================================
router.get('/:id', async (req, res) => {
  try {
    const equipment = equipmentData.find(eq => eq.id === req.params.id);
    if (!equipment) {
      return res.status(404).json({ error: 'Equipment not found' });
    }
    res.json(equipment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// CREATE EQUIPMENT
// ============================================
router.post('/', async (req, res) => {
  try {
    const { id, name, type, location, health, status, ruleOfLife } = req.body;

    if (!id || !name || !type || !location || health === undefined || !status || !ruleOfLife) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const newEquipment = {
      id,
      name,
      type,
      location,
      health,
      status,
      ruleOfLife,
      lastUpdated: new Date()
    };

    equipmentData.push(newEquipment);
    res.status(201).json(newEquipment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// UPDATE EQUIPMENT
// ============================================
router.put('/:id', async (req, res) => {
  try {
    const { name, type, location, health, status, ruleOfLife } = req.body;
    const equipmentIndex = equipmentData.findIndex(eq => eq.id === req.params.id);

    if (equipmentIndex === -1) {
      return res.status(404).json({ error: 'Equipment not found' });
    }

    equipmentData[equipmentIndex] = {
      ...equipmentData[equipmentIndex],
      name,
      type,
      location,
      health,
      status,
      ruleOfLife,
      lastUpdated: new Date()
    };

    res.json(equipmentData[equipmentIndex]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// DELETE EQUIPMENT
// ============================================
router.delete('/:id', async (req, res) => {
  try {
    const equipmentIndex = equipmentData.findIndex(eq => eq.id === req.params.id);
    if (equipmentIndex === -1) {
      return res.status(404).json({ error: 'Equipment not found' });
    }

    const deletedEquipment = equipmentData.splice(equipmentIndex, 1)[0];
    res.json({ message: 'Equipment deleted successfully', equipment: deletedEquipment });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// UPDATE EQUIPMENT HEALTH
// ============================================
router.patch('/:id/health', async (req, res) => {
  try {
    const { health } = req.body;
    const equipmentIndex = equipmentData.findIndex(eq => eq.id === req.params.id);

    if (equipmentIndex === -1) {
      return res.status(404).json({ error: 'Equipment not found' });
    }

    if (health === undefined || health < 0 || health > 100) {
      return res.status(400).json({ error: 'Valid health score (0-100) is required' });
    }

    // Determine status based on health score
    let status = 'good';
    if (health < 60) status = 'critical';
    else if (health < 80) status = 'warning';

    equipmentData[equipmentIndex].health = health;
    equipmentData[equipmentIndex].status = status;
    equipmentData[equipmentIndex].lastUpdated = new Date();

    res.json(equipmentData[equipmentIndex]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
module.exports.setDataRefs = setDataRefs;