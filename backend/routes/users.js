const express = require('express');
const router = express.Router();

// Import in-memory data from server.js
let equipmentData;
let alertsData;
let maintenanceData;
let usersData;

// Function to set data reference (called from server.js)
function setDataRefs(equipment, alerts, maintenance, users) {
  equipmentData = equipment;
  alertsData = alerts;
  maintenanceData = maintenance;
  usersData = users;
}

module.exports.setDataRefs = setDataRefs;

// ============================================
// GET ALL USERS
// ============================================
router.get('/', async (req, res) => {
  try {
    // Return users without passwords
    const users = usersData.map(user => ({
      _id: user._id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt
    }));
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// GET USER BY ID
// ============================================
router.get('/:id', async (req, res) => {
  try {
    const user = usersData.find(u => u._id === req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    // Return user without password
    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// REGISTER USER
// ============================================
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    // Check if user already exists
    const existingUser = usersData.find(u => u.email === email);
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    const newUser = {
      _id: Date.now().toString(),
      name,
      email,
      password, // In production, this should be hashed
      createdAt: new Date()
    };

    usersData.push(newUser);

    // Return user without password
    const { password: _, ...userWithoutPassword } = newUser;
    res.status(201).json({
      message: 'User registered successfully',
      user: userWithoutPassword
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// CREATE USER (legacy route)
// ============================================
router.post('/', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const newUser = {
      _id: Date.now().toString(),
      name,
      email,
      password,
      createdAt: new Date()
    };

    usersData.push(newUser);
    const { password: _, ...userWithoutPassword } = newUser;
    res.status(201).json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
module.exports.setDataRefs = setDataRefs;
