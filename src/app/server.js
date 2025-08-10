import express from 'express';
import bodyParser from 'body-parser';
import connectDB from '../lib/db.js';
import userRoutes from '../routes/userRoutes.js';
import gameRoutes from '../routes/gameRoutes.js';
import reviewRoutes from '../routes/reviewRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(bodyParser.json());

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/games', gameRoutes);
app.use('/api', reviewRoutes); // review routes are prefixed with /api

app.get('/', (req, res) => {
  res.send('GaminDom API is running');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
