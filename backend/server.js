import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
//import expenseRoutes from './routes/expenseRoutes.js';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
//app.use('/api/expenses', expenseRoutes);

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    app.listen(process.env.PORT || 5000, () => console.log('Server is running...'));
}).catch(err => console.error(err));