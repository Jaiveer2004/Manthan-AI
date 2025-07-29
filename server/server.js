import express from 'express';
import cors from 'cors';
import compression from 'compression';
import dotenvx from '@dotenvx/dotenvx'
import connectDB from './config/database.js';

// Extra imports:
import authRoutes from './routes/authRoutes.js';
import emailRoute from './routes/emailRoute.js';
import testEmail from './routes/testEmail.js'

dotenvx.config();

// Connect to database
connectDB();

const app = express();

// Middlewares
app.use(compression()); // Enable gzip compression
app.use(cors());
app.use(express.json({ limit: '10mb' })); // Set JSON payload limit

app.use('/api/auth', authRoutes);
app.use('/api/email', emailRoute);
app.use('/api/test', testEmail);

// Routes : Temp for checking the server
app.get('/', (request, response) => {
  response.send("Manthan server is live!");
});

app.get('/api/test', (request, response) => {
  response.json({status: "OK", message: "Frontend-Backend connected!"});
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server is running at: http://localhost:${port}`);
});