import UserModel from '../models/user.model.js';
import { Webhook } from 'svix';

export const clerkWebHooks = async (req, res) => {
  try {
    // Create a Svix instance with the Clerk webhook secret
    const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    // Getting headers
    const headers = {
      'svix-id': req.headers['svix-id'],
      'svix-timestamp': req.headers['svix-timestamp'],
      'svix-signature': req.headers['svix-signature'],
    };

    // Verify the webhook signature
    await whook.verify(JSON.stringify(req.body), headers);

    // Getting Data from the request body
    const { data, type } = req.body;
    if (!data || !type) {
      return res.status(400).json({
        success: false,
        error: 'Invalid webhook payload',
      });
    }
    // Handle different webhook events
    switch (type) {
      case 'user.created': {
        const userData = {
          _id: data.id,
          email: data.email_addresses[0].email_address,
          username: data.first_name + ' ' + data.last_name,
          image: data.image_url,
        };
        await UserModel.create(userData);
        break;
      }

      case 'user.updated': {
        const userData = {
          _id: data.id,
          email: data.email_addresses[0].email_address,
          username: data.first_name + ' ' + data.last_name,
          image: data.image_url,
        };
        await UserModel.findByIdAndUpdate(data.id, userData);
        break;
      }

      case 'user.deleted': {
        await UserModel.findByIdAndDelete(data.id);
        break;
      }

      default:
        break;
    }

    // Respond with a success status
    return res.status(200).json({
      success: true,
      message: 'Webhook Received',
    });
  } catch (error) {
    console.error('Error handling Clerk webhook:', error.message);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
