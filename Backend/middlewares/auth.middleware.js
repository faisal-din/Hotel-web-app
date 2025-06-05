import { Message } from 'svix/dist/api/message.js';
import UserModel from '../models/user.model.js';

export const isAuthenticated = async (req, res, next) => {
  const { userId } = req.auth;

  console.log('Authenticated User ID:', userId);

  if (!userId) {
    return res.status(401).json({ success: false, error: 'Unauthorized' });
  } else {
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Authentication Error: User not found',
      });
    }
    req.user = user;
    next();
  }
};
