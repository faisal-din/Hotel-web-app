import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/dB.js';
import { clerkMiddleware } from '@clerk/express';
import { clerkWebHooks } from './controllers/clerkWebHooks.js';

// App Config
const app = express();
const port = process.env.PORT || 4000;
connectDB();

// Middleware
app.use(express.json());
app.use(cors());
app.use(clerkMiddleware());

// API Endpoints
app.use('/api/clerk', clerkWebHooks);

app.get('/', (req, res) => {
  res.send('API is running');
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port http://localhost:${port}`);
});
