import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Edit, Delete } from '@mui/icons-material';

const Expenses = () => {
    const [expenses, setExpenses] = useState([]);
    const navigate = useNavigate(); 

    useEffect(() => {
        const fetchExpenses = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/expenses');
                setExpenses(response.data);
            } catch (err) {
                console.error('Greška prilikom dohvatanja troškova:', err);
            }
        };
        fetchExpenses();
    }, []);

    const deleteExpense = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/expenses/${id}`);
            setExpenses(expenses.filter((expense) => expense._id !== id));
        } catch (err) {
            console.error('Greška prilikom brisanja troška:', err);
        }
    };

    const editExpense = (expense) => {
        navigate('/add-expense', { state: { expense } }); 
    };

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
                        <th>Changes</th>
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
                            <td>
                                <span className="icon-button" onClick={() => editExpense(expense)}>
                                    <Edit/>
                                </span>
                                <span className="icon-button" onClick={() => deleteExpense(expense._id)}>
                                    <Delete/>
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Expenses;
