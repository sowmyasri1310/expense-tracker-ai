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

  const [customCategory, setCustomCategory] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const standardCategories = ['General', 'Food', 'Utilities', 'Shopping', 'Travel', 'Entertainment', 'Salary'];

  // Update form if prefilled data changes (e.g., from OCR)
  useEffect(() => {
    if (prefilledData) {
      const isStandard = standardCategories.includes(prefilledData.category);
      setFormData(prev => ({
        ...prev,
        amount: prefilledData.amount || prev.amount,
        date: prefilledData.date || prev.date,
        time: prefilledData.time || prev.time,
        description: prefilledData.description || prev.description,
        category: isStandard ? prefilledData.category : 'Other',
        type: 'expense' // Assumes invoices are expenses
      }));

      if (!isStandard && prefilledData.category) {
        setCustomCategory(prefilledData.category);
        setShowCustomInput(true);
      } else {
        setCustomCategory('');
        setShowCustomInput(false);
      }
    }
  }, [prefilledData]);

  // Update form if editing a transaction
  useEffect(() => {
    if (editingTransaction) {
      const isStandard = standardCategories.includes(editingTransaction.category);
      setFormData({
        type: editingTransaction.type,
        date: editingTransaction.date,
        time: editingTransaction.time || new Date().toTimeString().split(' ')[0].substring(0, 5),
        description: editingTransaction.description,
        amount: editingTransaction.amount,
        category: isStandard ? editingTransaction.category : 'Other'
      });

      if (!isStandard && editingTransaction.category) {
        setCustomCategory(editingTransaction.category);
        setShowCustomInput(true);
      } else {
        setCustomCategory('');
        setShowCustomInput(false);
      }
    }
  }, [editingTransaction]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCategoryChange = (e) => {
    const val = e.target.value;
    setFormData(prev => ({ ...prev, category: val }));
    if (val === 'Other') {
      setShowCustomInput(true);
    } else {
      setShowCustomInput(false);
      setCustomCategory('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const submissionData = {
      ...formData,
      category: formData.category === 'Other' ? customCategory.trim() || 'Other' : formData.category
    };

    try {
      if (editingTransaction) {
        const response = await axios.put(`/api/transactions/${editingTransaction._id}`, submissionData);
        onTransactionUpdated(response.data);
      } else {
        const response = await axios.post('/api/transactions', submissionData);
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
      setCustomCategory('');
      setShowCustomInput(false);
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
          <select name="category" value={formData.category} onChange={handleCategoryChange} className="form-control" required>
            {standardCategories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
            <option value="Other">Other (Custom)</option>
          </select>
        </div>
      </div>

      {showCustomInput && (
        <div className="form-group">
          <label>Custom Category Name</label>
          <input 
            type="text" 
            value={customCategory} 
            onChange={(e) => setCustomCategory(e.target.value)} 
            className="form-control" 
            placeholder="Enter custom category" 
            required 
          />
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div className="form-group">
          <label>Date</label>
          <input type="date" name="date" value={formData.date} onChange={handleChange} className="form-control" required>
          </input>
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
