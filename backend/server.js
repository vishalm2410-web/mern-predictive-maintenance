require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const path = require('path');

// ============================================
// MIDDLEWARE
// ============================================
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from parent directory (frontend)
app.use(express.static(path.join(__dirname, '..')));

// ============================================
// IN-MEMORY DATA STORE (for demo purposes)
// ============================================
let equipmentData = [
  {
    id: 'PUMP-001',
    name: 'Pump Unit #1',
    type: 'Centrifugal Pump',
    location: 'Building A, Floor 2',
    health: 82,
    status: 'good',
    ruleOfLife: 945,
    lastUpdated: new Date()
  },
  {
    id: 'MOTOR-002',
    name: 'Motor Unit #2',
    type: 'Electric Motor',
    location: 'Building A, Floor 3',
    health: 91,
    status: 'good',
    ruleOfLife: 1220,
    lastUpdated: new Date()
  },
  {
    id: 'PUMP-003',
    name: 'Pump Unit #3',
    type: 'Centrifugal Pump',
    location: 'Building B, Floor 1',
    health: 38,
    status: 'critical',
    ruleOfLife: 15,
    lastUpdated: new Date()
  },
  {
    id: 'COMPRESSOR-004',
    name: 'Compressor Unit #4',
    type: 'Air Compressor',
    location: 'Building C, Floor 1',
    health: 65,
    status: 'warning',
    ruleOfLife: 325,
    lastUpdated: new Date()
  },
  {
    id: 'MOTOR-005',
    name: 'Motor Unit #5',
    type: 'Electric Motor',
    location: 'Building A, Floor 1',
    health: 88,
    status: 'good',
    ruleOfLife: 780,
    lastUpdated: new Date()
  }
];

let alertsData = [
  {
    type: 'critical',
    message: 'Pump #3 bearing temperature exceeds threshold. Maintenance required within 24 hours.',
    equipmentId: 'PUMP-003',
    acknowledged: false,
    createdAt: new Date()
  },
  {
    type: 'warning',
    message: 'Motor #1 vibration levels elevated. Schedule inspection.',
    equipmentId: 'MOTOR-002',
    acknowledged: false,
    createdAt: new Date()
  },
  {
    type: 'info',
    message: 'Predictive model updated. New anomaly detection parameters active.',
    acknowledged: false,
    createdAt: new Date()
  }
];

let maintenanceData = [
  {
    date: '2026-03-22',
    equipment: 'MOTOR-002',
    type: 'Predictive Inspection',
    status: 'completed',
    duration: 2.5,
    cost: 450,
    description: 'Routine predictive maintenance inspection'
  },
  {
    date: '2026-03-20',
    equipment: 'PUMP-001',
    type: 'Seal Replacement',
    status: 'completed',
    duration: 4.0,
    cost: 1200,
    description: 'Replaced worn pump seals'
  },
  {
    date: '2026-03-18',
    equipment: 'COMPRESSOR-004',
    type: 'Oil Change',
    status: 'completed',
    duration: 1.5,
    cost: 350,
    description: 'Regular oil change and filter replacement'
  },
  {
    date: '2026-03-15',
    equipment: 'MOTOR-005',
    type: 'Bearing Lubrication',
    status: 'completed',
    duration: 1.0,
    cost: 200,
    description: 'Applied bearing lubricant'
  },
  {
    date: '2026-03-10',
    equipment: 'PUMP-001',
    type: 'Vibration Analysis',
    status: 'completed',
    duration: 3.0,
    cost: 600,
    description: 'Comprehensive vibration analysis'
  }
];

// ============================================
// MONGODB CONNECTION (optional - will work without it)
// ============================================
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/mern-app';

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => console.log('MongoDB not available, using in-memory data store:', err.message));

// ============================================
// IMPORT ROUTES
// ============================================
const equipmentRoutes = require('./routes/equipment');
const alertRoutes = require('./routes/alerts');
const maintenanceRoutes = require('./routes/maintenance');
const metricsRoutes = require('./routes/metrics');

// Set data references for routes
if (equipmentRoutes.setDataRefs) {
  equipmentRoutes.setDataRefs(equipmentData, alertsData, maintenanceData);
}
if (alertRoutes.setDataRefs) {
  alertRoutes.setDataRefs(equipmentData, alertsData, maintenanceData);
}
if (maintenanceRoutes.setDataRefs) {
  maintenanceRoutes.setDataRefs(equipmentData, alertsData, maintenanceData);
}
if (metricsRoutes.setDataRefs) {
  metricsRoutes.setDataRefs(equipmentData, alertsData, maintenanceData);
}

// ============================================
// BASIC ROUTES
// ============================================
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to MERN Backend API' });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

// ============================================
// API ROUTES
// ============================================
app.use('/api/equipment', equipmentRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/maintenance', maintenanceRoutes);
app.use('/api/metrics', metricsRoutes);

// ============================================
// ERROR HANDLING MIDDLEWARE
// ============================================
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({ 
    error: 'Internal server error',
    message: err.message 
  });
});

// ============================================
// 404 HANDLER
// ============================================
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// ============================================
// SERVER STARTUP
// ============================================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
