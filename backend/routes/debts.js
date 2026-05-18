const express = require('express');
const router = express.Router();
const Debt = require('../models/Debt');

// Get all debts
router.get('/', async (req, res) => {
  try {
    const debts = await Debt.find().sort({ createdAt: -1 });
    res.json(debts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add a new debt
router.post('/', async (req, res) => {
  const debt = new Debt({
    personName: req.body.personName,
    amount: req.body.amount,
    type: req.body.type,
    status: req.body.status || 'pending',
    description: req.body.description
  });

  try {
    const newDebt = await debt.save();
    res.status(201).json(newDebt);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update a debt (e.g., mark as settled)
router.put('/:id', async (req, res) => {
  try {
    const updatedDebt = await Debt.findByIdAndUpdate(
      req.params.id,
      req.body,
      { returnDocument: 'after' }
    );
    res.json(updatedDebt);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a debt
router.delete('/:id', async (req, res) => {
  try {
    await Debt.findByIdAndDelete(req.params.id);
    res.json({ message: 'Debt deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
