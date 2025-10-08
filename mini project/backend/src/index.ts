import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { json } from 'express';
import userRoutes from './routes/userRoutes';
import menuRoutes from './routes/menuRoutes';
import reservationRoutes from './routes/reservationRoutes';
import orderRoutes from './routes/orderRoutes';
import reviewRoutes from './routes/reviewRoutes';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Allow production Vercel domain, preview domains, and localhost during development
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:3000',
  'https://localhost:3000'
].filter(Boolean) as string[];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // allow server-to-server and curl
    const isVercelPreview = /https:\/\/.+\.vercel\.app$/.test(origin);
    if (allowedOrigins.includes(origin) || isVercelPreview) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));

app.use(json());

// Modular routes
app.use('/api/auth', userRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);

// Root route for base URL
app.get('/', (req, res) => {
  res.send('Cafe API is running');
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});