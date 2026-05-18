const mongoose = require('mongoose');

const DebtSchema = new mongoose.Schema({
  personName: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['borrowed', 'lent'] // 'borrowed' means I owe them, 'lent' means they owe me
  },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'settled'],
    default: 'pending'
  },
  description: {
    type: String
  }
}, { timestamps: true });

module.exports = mongoose.model('Debt', DebtSchema);
