import express from 'express';
import upload from '../middlewares/multer.middleware.js';
import { isAuthenticated } from '../middlewares/auth.middleware.js';
import {
  createRoom,
  getAllRooms,
  getOwnerRooms,
  toggleRoomAvailability,
} from '../controllers/room.controller.js';

const roomRouter = express.Router();

roomRouter.post(
  '/create',
  upload.array('images', 4),
  isAuthenticated,
  createRoom
);

roomRouter.get('/', getAllRooms);

roomRouter.get('/owner', isAuthenticated, getOwnerRooms);

roomRouter.get('/toggle-availablity', isAuthenticated, toggleRoomAvailability);

export default roomRouter;
