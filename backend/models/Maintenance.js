const mongoose = require('mongoose');

const maintenanceSchema = new mongoose.Schema(
  {
    date: {
      type: String,
      required: true,
    },
    equipment: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['completed', 'scheduled', 'in-progress', 'overdue'],
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    cost: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Maintenance', maintenanceSchema);
