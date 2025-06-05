import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/dB.js';
import { clerkMiddleware } from '@clerk/express';
import { clerkWebHooks } from './controllers/clerkWebHooks.js';
import userRouter from './routes/user.routes.js';
import hotelRouter from './routes/hotel.routes.js';
import connectCloudinary from './config/cloudinary.js';
import roomRouter from './routes/room.routes.js';
import bookingRouter from './routes/booking.routes.js';
import { stripeWebHooks } from './controllers/stripe.webhooks.js';

// App Config
const app = express();
const port = process.env.PORT || 4000;
connectDB();
connectCloudinary();

// Middleware
app.use(cors());
app.use(express.json());
app.use(clerkMiddleware());

//  API to listen to Stripe Webhooks
app.post(
  'api/stripe',
  express.raw({ type: 'application/json' }),
  stripeWebHooks
);

// API Endpoints
app.use('/api/clerk', clerkWebHooks);

app.use('/api/users', userRouter);
app.use('/api/hotels', hotelRouter);
app.use('/api/rooms', roomRouter);
app.use('/api/bookings', bookingRouter);

app.get('/', (req, res) => {
  res.send('API is running');
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port http://localhost:${port}`);
});
