import React, { useState } from 'react';
import axios from 'axios';

const AddExpense = () => {
    const [form, setForm] = useState({ category: '', amount: '', date: '', description: '' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        await axios.post('http://localhost:5000/api/expenses', form);
        setForm({ category: '', amount: '', date: '', description: '' });
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
                <button type="submit">Add expense</button>
            </form>
        </div>
    );
};

export default AddExpense;
