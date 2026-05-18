import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TransactionForm = ({ prefilledData, onTransactionAdded, editingTransaction, onTransactionUpdated, onCancelEdit }) => {
  const [formData, setFormData] = useState({
    type: 'expense',
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().split(' ')[0].substring(0, 5),
    description: '',
    amount: '',
    category: 'General'
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Update form if prefilled data changes (e.g., from OCR)
  useEffect(() => {
    if (prefilledData) {
      setFormData(prev => ({
        ...prev,
        amount: prefilledData.amount || prev.amount,
        date: prefilledData.date || prev.date,
        time: prefilledData.time || prev.time,
        description: prefilledData.description || prev.description,
        category: prefilledData.category || prev.category,
        type: 'expense' // Assumes invoices are expenses
      }));
    }
  }, [prefilledData]);

  // Update form if editing a transaction
  useEffect(() => {
    if (editingTransaction) {
      setFormData({
        type: editingTransaction.type,
        date: editingTransaction.date,
        time: editingTransaction.time || new Date().toTimeString().split(' ')[0].substring(0, 5),
        description: editingTransaction.description,
        amount: editingTransaction.amount,
        category: editingTransaction.category
      });
    }
  }, [editingTransaction]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (editingTransaction) {
        const response = await axios.put(`/api/transactions/${editingTransaction._id}`, formData);
        onTransactionUpdated(response.data);
      } else {
        const response = await axios.post('/api/transactions', formData);
        onTransactionAdded(response.data);
      }
      // Reset form
      setFormData({
        type: 'expense',
        date: new Date().toISOString().split('T')[0],
        time: new Date().toTimeString().split(' ')[0].substring(0, 5),
        description: '',
        amount: '',
        category: 'General'
      });
      if (onCancelEdit) onCancelEdit();
    } catch (err) {
      setError(`Failed to ${editingTransaction ? 'update' : 'save'} transaction.`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card">
      <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ margin: 0 }}>{editingTransaction ? 'Edit Transaction' : 'Add Transaction'}</h2>
        {editingTransaction && (
          <button type="button" className="btn btn-outline" onClick={onCancelEdit} style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}>
            Cancel
          </button>
        )}
      </div>
      
      {error && <p className="text-danger">{error}</p>}
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div className="form-group">
          <label>Type</label>
          <select name="type" value={formData.type} onChange={handleChange} className="form-control" required>
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
        </div>
        <div className="form-group">
          <label>Category</label>
          <input type="text" name="category" value={formData.category} onChange={handleChange} className="form-control" placeholder="e.g. Food, Salary" required />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div className="form-group">
          <label>Date</label>
          <input type="date" name="date" value={formData.date} onChange={handleChange} className="form-control" required />
        </div>
        <div className="form-group">
          <label>Time</label>
          <input type="time" name="time" value={formData.time} onChange={handleChange} className="form-control" required />
        </div>
      </div>

      <div className="form-group">
        <label>Description</label>
        <input type="text" name="description" value={formData.description} onChange={handleChange} className="form-control" placeholder="What was this for?" required />
      </div>

      <div className="form-group">
        <label>Amount (₹)</label>
        <input type="number" step="0.01" name="amount" value={formData.amount} onChange={handleChange} className="form-control" placeholder="0.00" required />
      </div>

      <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} disabled={loading}>
        {loading ? 'Saving...' : (editingTransaction ? 'Update Transaction' : 'Save Transaction')}
      </button>
    </form>
  );
};

export default TransactionForm;
