import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './routes/user/userRoutes';
import contactRoutes from './routes/contact/contactRoutes';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/user', userRoutes);
app.use('/contact', contactRoutes);

app.get('/', (req, res) => {
    res.send('Express server is running');
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
