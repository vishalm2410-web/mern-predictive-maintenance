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
// GET DASHBOARD METRICS
// ============================================
router.get('/', async (req, res) => {
  try {
    // Get all equipment
    const totalEquipment = equipmentData.length;
    const operationalEquipment = equipmentData.filter(eq => eq.status === 'good').length;
    const operationalStatus = totalEquipment > 0 ? Math.round((operationalEquipment / totalEquipment) * 100) : 0;

    // Calculate average RUL (Remaining Useful Life)
    const totalRUL = equipmentData.reduce((sum, eq) => sum + eq.ruleOfLife, 0);
    const avgRUL = totalEquipment > 0 ? Math.round(totalRUL / totalEquipment) : 0;

    // Get maintenance records for cost calculation
    const costSaved = maintenanceData.reduce((sum, record) => sum + record.cost, 0);

    // Calculate downtime prevented (simplified calculation)
    const downtimePrevented = Math.round(costSaved * 0.1); // Assuming 10% of maintenance cost represents prevented downtime

    const metrics = {
      operationalStatus,
      avgRUL,
      costSaved,
      downtimePrevented,
      totalEquipment,
      criticalEquipment: equipmentData.filter(eq => eq.status === 'critical').length,
      warningEquipment: equipmentData.filter(eq => eq.status === 'warning').length,
      goodEquipment: operationalEquipment
    };

    res.json(metrics);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// GET EQUIPMENT HEALTH DISTRIBUTION
// ============================================
router.get('/health-distribution', async (req, res) => {
  try {
    const distribution = {
      lowRisk: equipmentData.filter(eq => eq.health >= 80).length,
      mediumRisk: equipmentData.filter(eq => eq.health >= 60 && eq.health < 80).length,
      highRisk: equipmentData.filter(eq => eq.health >= 40 && eq.health < 60).length,
      critical: equipmentData.filter(eq => eq.health < 40).length
    };

    res.json(distribution);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// GET MAINTENANCE FORECAST
// ============================================
router.get('/maintenance-forecast', async (req, res) => {
  try {
    // Simple forecast based on current health and RUL
    const forecast = {
      thisWeek: equipmentData.filter(eq => eq.ruleOfLife <= 7).length,
      nextWeek: equipmentData.filter(eq => eq.ruleOfLife > 7 && eq.ruleOfLife <= 14).length,
      weekPlus2: equipmentData.filter(eq => eq.ruleOfLife > 14 && eq.ruleOfLife <= 21).length,
      weekPlus3: equipmentData.filter(eq => eq.ruleOfLife > 21 && eq.ruleOfLife <= 28).length,
      weekPlus4: equipmentData.filter(eq => eq.ruleOfLife > 28 && eq.ruleOfLife <= 35).length
    };

    res.json(forecast);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
module.exports.setDataRefs = setDataRefs;
