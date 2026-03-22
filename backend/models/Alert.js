const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['critical', 'warning', 'info'],
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    equipmentId: {
      type: String,
      required: false,
    },
    acknowledged: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Alert', alertSchema);
