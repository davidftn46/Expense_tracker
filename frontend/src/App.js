import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import Expenses from './pages/Expenses';
import AddExpense from './pages/AddExpense';

const App = () => {
    return (
        <Router>
            <header className="header">
                <div className="nav-left">
                    <Link to="/" className="nav-link">Home</Link>
                </div>
                <div className="nav-right">
                    <ul className="nav-links">
                        <li>
                            <Link to="/expenses" className="nav-link">Expenses</Link>
                        </li>
                        <li>
                            <Link to="/add-expense" className="nav-link">Add Expense</Link>
                        </li>
                        <li>
                            <Link to="/" className="nav-link">Graph</Link>
                        </li>
                    </ul>
                </div>
            </header>
            <Routes>
                <Route path="/expenses" element={<Expenses />} />
                <Route path="/add-expense" element={<AddExpense />} />
            </Routes>
        </Router>
    );
};

export default App;
