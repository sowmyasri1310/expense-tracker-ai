import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TransactionForm from '../components/TransactionForm';
import OcrUpload from '../components/OcrUpload';
import { Trash2, Edit2 } from 'lucide-react';

const TransactionsPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [prefilledData, setPrefilledData] = useState(null);
  const [editingTx, setEditingTx] = useState(null);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const res = await axios.get('/api/transactions');
      setTransactions(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleTransactionAdded = (newTx) => {
    setTransactions([newTx, ...transactions]);
    setPrefilledData(null); // Clear OCR data after adding
  };

  const handleTransactionUpdated = (updatedTx) => {
    setTransactions(transactions.map(t => t._id === updatedTx._id ? updatedTx : t));
    setEditingTx(null);
  };

  const handleCancelEdit = () => {
    setEditingTx(null);
  };

  const handleDataExtracted = (data) => {
    setPrefilledData(data);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/transactions/${id}`);
      setTransactions(transactions.filter(t => t._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <div className="grid-sidebar-layout">
        <div>
          <OcrUpload onDataExtracted={handleDataExtracted} />
          <TransactionForm 
            prefilledData={prefilledData} 
            onTransactionAdded={handleTransactionAdded} 
            editingTransaction={editingTx}
            onTransactionUpdated={handleTransactionUpdated}
            onCancelEdit={handleCancelEdit}
          />
        </div>
        
        <div className="card">
          <h2>Transaction History</h2>
          
          {/* Desktop Table View */}
          <div className="desktop-only" style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '1rem 0.5rem' }}>Date</th>
                  <th style={{ padding: '1rem 0.5rem' }}>Description</th>
                  <th style={{ padding: '1rem 0.5rem' }}>Category</th>
                  <th style={{ padding: '1rem 0.5rem' }}>Amount</th>
                  <th style={{ padding: '1rem 0.5rem' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {transactions.length === 0 && (
                  <tr><td colSpan="5" style={{ padding: '1rem', textAlign: 'center' }}>No transactions found.</td></tr>
                )}
                {transactions.map(tx => (
                  <tr key={tx._id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '1rem 0.5rem' }}>
                      {tx.date} <br/><span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{tx.time}</span>
                    </td>
                    <td style={{ padding: '1rem 0.5rem' }}>{tx.description}</td>
                    <td style={{ padding: '1rem 0.5rem' }}>
                      <span style={{ background: 'var(--background)', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.875rem' }}>
                        {tx.category}
                      </span>
                    </td>
                    <td style={{ padding: '1rem 0.5rem', fontWeight: '600', color: tx.type === 'income' ? 'var(--secondary)' : 'var(--danger)' }}>
                      {tx.type === 'income' ? '+' : '-'}₹{tx.amount.toFixed(2)}
                    </td>
                    <td style={{ padding: '1rem 0.5rem', display: 'flex', gap: '0.5rem' }}>
                      <button 
                        onClick={() => setEditingTx(tx)}
                        className="btn btn-outline"
                        style={{ padding: '0.5rem', border: 'none', color: 'var(--primary)' }}
                        title="Edit"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(tx._id)}
                        className="btn btn-outline text-danger"
                        style={{ padding: '0.5rem', border: 'none' }}
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card List View */}
          <div className="mobile-only">
            {transactions.length === 0 && (
              <p style={{ textAlign: 'center', padding: '1rem' }}>No transactions found.</p>
            )}
            {transactions.map(tx => (
              <div key={tx._id} className="mobile-tx-card">
                <div className="tx-header">
                  <div>
                    <strong style={{ display: 'block', fontSize: '1rem', marginBottom: '0.25rem' }}>{tx.description}</strong>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{tx.date} | {tx.time}</span>
                  </div>
                  <div style={{ fontWeight: '700', fontSize: '1.1rem', color: tx.type === 'income' ? 'var(--secondary)' : 'var(--danger)' }}>
                    {tx.type === 'income' ? '+' : '-'}₹{tx.amount.toFixed(2)}
                  </div>
                </div>
                <div className="tx-body">
                  <span style={{ background: 'var(--background)', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem' }}>
                    {tx.category}
                  </span>
                </div>
                <div className="tx-actions">
                  <button 
                    onClick={() => setEditingTx(tx)}
                    className="btn btn-outline"
                    style={{ padding: '0.4rem 0.8rem', borderColor: 'var(--primary)', color: 'var(--primary)', display: 'inline-flex', gap: '0.25rem', fontSize: '0.8rem' }}
                  >
                    <Edit2 size={14} /> Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(tx._id)}
                    className="btn btn-outline text-danger"
                    style={{ padding: '0.4rem 0.8rem', display: 'inline-flex', gap: '0.25rem', fontSize: '0.8rem' }}
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
};

export default TransactionsPage;
