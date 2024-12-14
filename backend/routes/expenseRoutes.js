import express from 'express';
import Expense from '../models/Expense.js';

const router = express.Router();

// Dodajemo novi trosak
router.post('/', async (req, res) => {
    try {
        const newExpense = new Expense(req.body);
        const savedExpense = await newExpense.save();
        res.status(201).json(savedExpense);
    } catch (err) {
        res.status(500).json(err);
    }
});

// Hvatamo sve troskove
router.get('/', async (req, res) => {
    try {
        const expenses = await Expense.find();
        res.status(200).json(expenses);
    } catch (err) {
        res.status(500).json(err);
    }
});

// Ažuriramo trosak
router.put('/:id', async (req, res) => {
    try {
        const updatedExpense = await Expense.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true } 
        );
        res.status(200).json(updatedExpense);
    } catch (err) {
        res.status(500).json(err);
    }
});

// Brisemo trosak
router.delete('/:id', async (req, res) => {
    try {
        await Expense.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Expense deleted successfully.' });
    } catch (err) {
        res.status(500).json(err);
    }
});

export default router;
