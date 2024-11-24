import mongoose from 'mongoose';

const ExpenseSchema = new mongoose.Schema({
    category: {type: String, required: true},
    amount: {type: Number, required: true},
    date: {type: Date, required: true},
    description: {type: String, default: ''},
});

const Expense = mongoose.model('Expense', ExpenseSchema);

export default Expense;