import express from 'express';
import {
  checkAvailablityAPI,
  createBooking,
  getHotelBookings,
  getUserBookings,
  stripePayment,
} from '../controllers/booking.controller.js';
import { isAuthenticated } from '../middlewares/auth.middleware.js';

const bookingRouter = express.Router();

bookingRouter.post('/check-availablity', checkAvailablityAPI);

bookingRouter.post('/book', isAuthenticated, createBooking);

bookingRouter.get('/user', isAuthenticated, getUserBookings);

bookingRouter.get('/hotel', isAuthenticated, getHotelBookings);

bookingRouter.post('/stripe-payment', isAuthenticated, stripePayment);

export default bookingRouter;
