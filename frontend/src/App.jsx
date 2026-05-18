import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import TransactionsPage from './pages/TransactionsPage';
import DebtsPage from './pages/DebtsPage';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/transactions" element={<TransactionsPage />} />
            <Route path="/debts" element={<DebtsPage />} />
          </Routes>
        </main>
        <Link to="/transactions" className="fab-btn" title="Add Transaction">
          <Plus size={32} />
        </Link>
      </div>
    </Router>
  );
}

export default App;
