import express from 'express';
import { isAuthenticated } from '../middlewares/auth.middleware.js';
import { registerHotel } from '../controllers/hotel.controller.js';

const hotelRouter = express.Router();

hotelRouter.post('/', isAuthenticated, registerHotel);

export default hotelRouter;
