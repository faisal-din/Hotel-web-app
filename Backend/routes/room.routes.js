import express from 'express';
import upload from '../middlewares/multer.middleware';
import { isAuthenticated } from '../middlewares/auth.middleware';
import { createRoom } from '../controllers/room.controller';

const roomRouter = express.Router();

roomRouter.post('/', upload.array('images, 4'), isAuthenticated, createRoom);

export default roomRouter;
