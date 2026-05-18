import React from 'react';
import { TrendingUp, TrendingDown, IndianRupee, Users } from 'lucide-react';

const DashboardCards = ({ income, expense, balance, debts }) => {
  return (
    <div className="grid-cards">
      <div className="card">
        <div className="flex-between">
          <h3 style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.875rem', textTransform: 'uppercase' }}>Total Balance</h3>
          <IndianRupee size={20} color="var(--primary)" />
        </div>
        <p style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--text-main)', margin: '0.5rem 0 0' }}>
          ₹{balance.toFixed(2)}
        </p>
      </div>
      
      <div className="card">
        <div className="flex-between">
          <h3 style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.875rem', textTransform: 'uppercase' }}>Total Income</h3>
          <TrendingUp size={20} color="var(--secondary)" />
        </div>
        <p style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--secondary)', margin: '0.5rem 0 0' }}>
          +₹{income.toFixed(2)}
        </p>
      </div>

      <div className="card">
        <div className="flex-between">
          <h3 style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.875rem', textTransform: 'uppercase' }}>Total Expenses</h3>
          <TrendingDown size={20} color="var(--danger)" />
        </div>
        <p style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--danger)', margin: '0.5rem 0 0' }}>
          -₹{expense.toFixed(2)}
        </p>
      </div>

      <div className="card">
        <div className="flex-between">
          <h3 style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.875rem', textTransform: 'uppercase' }}>Active Debts</h3>
          <Users size={20} color="#F59E0B" />
        </div>
        <p style={{ fontSize: '2rem', fontWeight: '700', color: '#F59E0B', margin: '0.5rem 0 0' }}>
          ₹{debts.toFixed(2)}
        </p>
      </div>
    </div>
  );
};

export default DashboardCards;
