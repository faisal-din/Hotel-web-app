import express from 'express';
import { isAuthenticated } from '../middlewares/auth.middleware';
import { registerHotel } from '../controllers/hotel.controller';

const hotelRouter = express.Router();

hotelRouter.post('/', isAuthenticated, registerHotel);

export default hotelRouter;
