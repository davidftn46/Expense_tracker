import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const AddExpense = () => {
    const location = useLocation(); 
    const navigate = useNavigate(); 
    const [form, setForm] = useState({ category: '', amount: '', date: '', description: '' });

    const isEditing = location.state?.expense; 

    useEffect(() => {
        if (isEditing) {
            const { category, amount, date, description } = location.state.expense;
            setForm({
                category,
                amount,
                date: new Date(date).toISOString().split('T')[0], 
                description,
            });
        }
    }, [isEditing]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (isEditing) {
                await axios.put(
                    `http://localhost:5000/api/expenses/${location.state.expense._id}`,
                    form
                );
            } else {
                await axios.post('http://localhost:5000/api/expenses', form);
            }

            setForm({
                category: '',
                amount: '',
                date: '',
                description: '',
            });
            navigate('/expenses');
        } catch (err) {
            console.error('Greška prilikom čuvanja troška:', err);
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit} className='form-container'>        
                <select 
                value={form.category} 
                onChange={(e) => setForm({ ...form, category: e.target.value })} 
                required
                >
                <option value="" disabled>Choose a category</option>
                <option value="Food">Food</option>
                <option value="Clothes">Clothes</option>
                <option value="Bills">Bills</option>
                <option value="Transport">Transport</option>
                <option value="Vacation">Vacation</option>
                <option value="Party">Party</option>
                <option value="Other">Other</option>
                </select>
                <br />

                <input type="number" placeholder="Price" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} required /> <br/>
                
                <input 
                    type="date" 
                    value={form.date} 
                    onChange={(e) => setForm({ ...form, date: e.target.value })} 
                    max={new Date().toISOString().split("T")[0]} 
                    required 
                /> 
                <br/>

                <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /> <br/>
                <button type="submit">{isEditing ? 'Save Changes' : 'Add Expense'}</button>
            </form>
        </div>
    );
};

export default AddExpense;
