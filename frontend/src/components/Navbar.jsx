import React from 'react';
import { NavLink } from 'react-router-dom';
import { Wallet, PieChart, Receipt, Users } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="navbar">
      <NavLink to="/" className="nav-brand">
        <Wallet size={24} />
        <span>ExpenseTracker</span>
      </NavLink>
      <div className="nav-links">
        <NavLink 
          to="/" 
          className={({isActive}) => isActive ? "nav-link active" : "nav-link"}
          style={{display: 'flex', alignItems: 'center', gap: '0.25rem'}}
        >
          <PieChart size={18} /> Dashboard
        </NavLink>
        <NavLink 
          to="/transactions" 
          className={({isActive}) => isActive ? "nav-link active" : "nav-link"}
          style={{display: 'flex', alignItems: 'center', gap: '0.25rem'}}
        >
          <Receipt size={18} /> Transactions
        </NavLink>
        <NavLink 
          to="/debts" 
          className={({isActive}) => isActive ? "nav-link active" : "nav-link"}
          style={{display: 'flex', alignItems: 'center', gap: '0.25rem'}}
        >
          <Users size={18} /> Debts
        </NavLink>
      </div>
    </nav>
  );
};

export default Navbar;
