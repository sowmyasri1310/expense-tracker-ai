import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DebtList from '../components/DebtList';

const DebtsPage = () => {
  const [debts, setDebts] = useState([]);
  const [formData, setFormData] = useState({
    personName: '',
    amount: '',
    type: 'borrowed', // or 'lent'
    description: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDebts();
  }, []);

  const fetchDebts = async () => {
    try {
      const res = await axios.get('/api/debts');
      setDebts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('/api/debts', formData);
      setDebts([res.data, ...debts]);
      setFormData({ personName: '', amount: '', type: 'borrowed', description: '' });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await axios.put(`/api/debts/${id}`, { status: newStatus });
      setDebts(debts.map(d => d._id === id ? res.data : d));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/debts/${id}`);
      setDebts(debts.filter(d => d._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
        <div className="card" style={{ alignSelf: 'start' }}>
          <h2 style={{ marginBottom: '1.5rem' }}>Add Debt / Loan</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Type</label>
              <select name="type" value={formData.type} onChange={handleChange} className="form-control" required>
                <option value="borrowed">I borrowed from someone</option>
                <option value="lent">I lent to someone</option>
              </select>
            </div>
            <div className="form-group">
              <label>Person Name</label>
              <input type="text" name="personName" value={formData.personName} onChange={handleChange} className="form-control" placeholder="Who?" required />
            </div>
            <div className="form-group">
              <label>Amount (₹)</label>
              <input type="number" step="0.01" name="amount" value={formData.amount} onChange={handleChange} className="form-control" placeholder="0.00" required />
            </div>
            <div className="form-group">
              <label>Description (Optional)</label>
              <input type="text" name="description" value={formData.description} onChange={handleChange} className="form-control" placeholder="Reason?" />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} disabled={loading}>
              {loading ? 'Adding...' : 'Add Record'}
            </button>
          </form>
        </div>

        <div>
          <h2>Debt Records</h2>
          <DebtList 
            debts={debts} 
            onStatusChange={handleStatusChange} 
            onDelete={handleDelete} 
          />
        </div>
      </div>
    </div>
  );
};

export default DebtsPage;
