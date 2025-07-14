import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenvx from '@dotenvx/dotenvx'

// Extra imports:
import authRoutes from './routes/authRoutes.js';
import emailRoute from './routes/emailRoute.js';

dotenvx.config();
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/email', emailRoute);

// Routes : Temp for checking the server
app.get('/', (request, response) => {
  response.send("Manthan server is live!");
});

app.get('/api/test', (request, response) => {
  response.json({status: "OK", message: "Frontend-Backend connected!"});
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected via Mongoose."))
  .catch((err) => console.error("Mongo Error: ", err));

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server is running at: http://localhost:${port}`);
});