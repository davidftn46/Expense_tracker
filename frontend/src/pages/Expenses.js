import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Expenses = () => {
    const [expenses, setExpenses] = useState([]);

    useEffect(() => {
        const fetchExpenses = async () => {
            const response = await axios.get('http://localhost:5000/api/expenses');
            setExpenses(response.data);
        };
        fetchExpenses();
    }, []);

    return (
        <div>
            <h1 className='table-title'>List of expenses</h1>
            <table className='content-table'>
                <thead>
                    <tr>
                        <th>Rank</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Date</th>
                        <th>Description</th>
                    </tr>
                </thead>
                <tbody>
                    {expenses.map((expense, index) => (
                        <tr key={expense._id}>
                            <td>{index + 1 + "."}</td>
                            <td>{expense.category}</td>
                            <td>{expense.amount + " $"}</td>
                            <td>{new Date(expense.date).toLocaleDateString()}</td>
                            <td>{expense.description}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Expenses;
