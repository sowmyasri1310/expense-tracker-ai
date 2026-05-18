import React from 'react';
import { CheckCircle, Clock } from 'lucide-react';

const DebtList = ({ debts, onStatusChange, onDelete }) => {
  if (debts.length === 0) {
    return <p style={{ color: 'var(--text-muted)' }}>No debts found. You are all settled up!</p>;
  }

  return (
    <div style={{ display: 'grid', gap: '1rem' }}>
      {debts.map(debt => (
        <div key={debt._id} className="card" style={{ padding: '1rem', borderLeft: `4px solid ${debt.type === 'borrowed' ? 'var(--danger)' : 'var(--secondary)'}` }}>
          <div className="flex-between">
            <div>
              <h4 style={{ margin: 0 }}>
                {debt.type === 'borrowed' ? 'You owe' : 'Owes you'}: {debt.personName}
              </h4>
              <p style={{ margin: '0.25rem 0 0', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                {debt.description || 'No description provided'}
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: debt.type === 'borrowed' ? 'var(--danger)' : 'var(--secondary)' }}>
                ₹{debt.amount.toFixed(2)}
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', justifyContent: 'flex-end' }}>
                <span style={{ 
                  display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem',
                  color: debt.status === 'settled' ? 'var(--secondary)' : '#F59E0B'
                }}>
                  {debt.status === 'settled' ? <CheckCircle size={14} /> : <Clock size={14} />}
                  {debt.status.toUpperCase()}
                </span>
              </div>
            </div>
          </div>
          
          <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
            {debt.status === 'pending' && (
              <button 
                className="btn btn-outline" 
                onClick={() => onStatusChange(debt._id, 'settled')}
                style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
              >
                Mark as Settled
              </button>
            )}
            <button 
              className="btn btn-outline text-danger" 
              onClick={() => onDelete(debt._id)}
              style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', border: 'none' }}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DebtList;
