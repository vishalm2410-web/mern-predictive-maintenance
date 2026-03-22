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
// GET ALL ALERTS
// ============================================
router.get('/', async (req, res) => {
  try {
    res.json(alertsData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// GET ALERT BY ID
// ============================================
router.get('/:id', async (req, res) => {
  try {
    const alert = alertsData.find(a => a._id === req.params.id || a.id === req.params.id);
    if (!alert) {
      return res.status(404).json({ error: 'Alert not found' });
    }
    res.json(alert);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// CREATE ALERT
// ============================================
router.post('/', async (req, res) => {
  try {
    const { type, message, equipmentId } = req.body;

    if (!type || !message) {
      return res.status(400).json({ error: 'Type and message are required' });
    }

    const newAlert = {
      _id: Date.now().toString(),
      type,
      message,
      equipmentId,
      acknowledged: false,
      createdAt: new Date()
    };

    alertsData.push(newAlert);
    res.status(201).json(newAlert);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// ACKNOWLEDGE ALERT
// ============================================
router.patch('/:id/acknowledge', async (req, res) => {
  try {
    const alertIndex = alertsData.findIndex(a => a._id === req.params.id || a.id === req.params.id);
    if (alertIndex === -1) {
      return res.status(404).json({ error: 'Alert not found' });
    }

    alertsData[alertIndex].acknowledged = true;
    res.json(alertsData[alertIndex]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// DELETE ALERT
// ============================================
router.delete('/:id', async (req, res) => {
  try {
    const alertIndex = alertsData.findIndex(a => a._id === req.params.id || a.id === req.params.id);
    if (alertIndex === -1) {
      return res.status(404).json({ error: 'Alert not found' });
    }

    const deletedAlert = alertsData.splice(alertIndex, 1)[0];
    res.json({ message: 'Alert deleted successfully', alert: deletedAlert });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// GET UNACKNOWLEDGED ALERTS
// ============================================
router.get('/status/unacknowledged', async (req, res) => {
  try {
    const unacknowledgedAlerts = alertsData.filter(alert => !alert.acknowledged);
    res.json(unacknowledgedAlerts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
module.exports.setDataRefs = setDataRefs;
