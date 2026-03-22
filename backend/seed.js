require('dotenv').config();
const mongoose = require('mongoose');
const Equipment = require('./models/Equipment');
const Alert = require('./models/Alert');
const Maintenance = require('./models/Maintenance');

const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/mern-app';

const seedData = async () => {
  try {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    // Clear existing data
    await Equipment.deleteMany({});
    await Alert.deleteMany({});
    await Maintenance.deleteMany({});

    console.log('Cleared existing data');

    // Seed Equipment
    const equipmentData = [
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

    await Equipment.insertMany(equipmentData);
    console.log('Equipment data seeded');

    // Seed Alerts
    const alertData = [
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

    await Alert.insertMany(alertData);
    console.log('Alert data seeded');

    // Seed Maintenance History
    const maintenanceData = [
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

    await Maintenance.insertMany(maintenanceData);
    console.log('Maintenance data seeded');

    console.log('Database seeded successfully!');
    process.exit(0);

  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedData();
