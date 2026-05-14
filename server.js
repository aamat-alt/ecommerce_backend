const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');

const app = express();

app.use(cors({
  origin: ['http://localhost:5173', 'https://ecommerce-frontend-design-rose-two.vercel.app'],
  credentials: true
}));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
})
.then(() => console.log('MongoDB Connected ✅'))
.catch(err => console.log('DB Error:', err.message));

app.get('/', (req, res) => {
  res.json({ message: 'Backend is running!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});