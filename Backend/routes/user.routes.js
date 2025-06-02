import express from 'express';
import { isAuthenticated } from '../middlewares/auth.middleware';
import {
  getUserData,
  storeRecentSearchedcities,
} from '../controllers/user.controller';

const userRouter = express.Router();

userRouter.get('/', isAuthenticated, getUserData);

userRouter.get(
  '/store-recent-search',
  isAuthenticated,
  storeRecentSearchedcities
);

export default userRouter;
