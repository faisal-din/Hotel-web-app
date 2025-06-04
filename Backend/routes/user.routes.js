import express from 'express';
import { isAuthenticated } from '../middlewares/auth.middleware.js';
import {
  getUserData,
  storeRecentSearchedcities,
} from '../controllers/user.controller.js';

const userRouter = express.Router();

userRouter.get('/', isAuthenticated, getUserData);

userRouter.post(
  '/store-recent-search',
  isAuthenticated,
  storeRecentSearchedcities
);

export default userRouter;
