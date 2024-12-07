import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import './App.css';
import Expenses from './pages/Expenses';
import AddExpense from './pages/AddExpense';
import Graph from './pages/Graph';
import Home from './pages/Home';

const App = () => {
    return (
        <Router>
            <header className="header">
                <div className="nav-left">
                    <Link to="/home" className="nav-link">Home</Link>
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
                            <Link to="/graph" className="nav-link">Graph</Link>
                        </li>
                    </ul>
                </div>
            </header>
            <Routes>
                {/*Po default-u se preusmeravamo na Home stranicu*/}
                <Route path="/" element={<Navigate to="/home" replace/>}/>
                <Route path="/expenses" element={<Expenses/>}/>
                <Route path="/add-expense" element={<AddExpense/>}/>
                <Route path="/graph" element={<Graph/>}/>
                <Route path="/home" element={<Home/>}/>
            </Routes>
        </Router>
    );
};

export default App;
