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

export default router;
