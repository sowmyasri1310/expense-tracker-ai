import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DashboardCards from '../components/DashboardCards';
import ExpenseChart from '../components/ExpenseChart';

const Dashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [debts, setDebts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [txRes, debtsRes] = await Promise.all([
          axios.get('/api/transactions'),
          axios.get('/api/debts')
        ]);
        setTransactions(txRes.data);
        setDebts(debtsRes.data);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <div>Loading dashboard...</div>;
  }

  // Calculate totals
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const balance = totalIncome - totalExpense;

  const activeDebts = debts
    .filter(d => d.status === 'pending')
    .reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div>
      <h1>Financial Dashboard</h1>
      <p>Welcome back! Here is your financial overview.</p>
      
      <DashboardCards 
        income={totalIncome} 
        expense={totalExpense} 
        balance={balance} 
        debts={activeDebts} 
      />

      <div className="grid-cards" style={{ gridTemplateColumns: '1fr 1fr' }}>
        <div className="card">
          <h2>Expense Analysis</h2>
          <ExpenseChart data={transactions} />
        </div>
        <div className="card">
          <h2>Recent Transactions</h2>
          {transactions.slice(0, 5).length > 0 ? (
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {transactions.slice(0, 5).map(tx => (
                <li key={tx._id} style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem 0', borderBottom: '1px solid var(--border)' }}>
                  <div>
                    <div style={{ fontWeight: '500' }}>{tx.description}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{tx.date} | {tx.category}</div>
                  </div>
                  <div style={{ fontWeight: '600', color: tx.type === 'income' ? 'var(--secondary)' : 'var(--danger)' }}>
                    {tx.type === 'income' ? '+' : '-'}₹{tx.amount.toFixed(2)}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>No recent transactions.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
