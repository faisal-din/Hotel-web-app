import express from 'express';
import upload from '../middlewares/multer.middleware';
import { isAuthenticated } from '../middlewares/auth.middleware';
import {
  createRoom,
  getAllRooms,
  getOwnerRooms,
  toggleRoomAvailability,
} from '../controllers/room.controller';

const roomRouter = express.Router();

roomRouter.post('/', upload.array('images, 4'), isAuthenticated, createRoom);

roomRouter.get('/', getAllRooms);

roomRouter.get('/owner', isAuthenticated, getOwnerRooms);

roomRouter.get('/toggle-availablity', isAuthenticated, toggleRoomAvailability);

export default roomRouter;
