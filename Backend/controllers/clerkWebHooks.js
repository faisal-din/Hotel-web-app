import UserModel from '../models/user.model.js';
import { Webhook } from 'svix';

export const clerkWebHooks = async (req, res) => {
  try {
    // Create a Svix instance with the Clerk webhook secret
    const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    // Getting headers
    const header = {
      'svix-id': req.headers['svix-id'],
      'svix-timestamp': req.headers['svix-timestamp'],
      'svix-signature': req.headers['svix-signature'],
    };

    // Verify the webhook signature
    await whook.verify(JSON.stringify(req.body, header));

    // Getting Data from the request body

    const { data, type } = req.body;

    const userData = {
      _id: data.id,
      email: data.email_addresses[0]?.email_address,
      username: data.first_name + ' ' + data.last_name,
      image: data.image_url,
    };

    // Handle different webhook events
    switch (type) {
      case 'user.created':
        await UserModel.create(userData);
        break;

      case 'user.updated':
        await UserModel.findOneAndUpdate({ _id: data.id }, userData);
        break;

      case 'user.deleted':
        await UserModel.findOneAndDelete({ _id: data.id });
        break;

      default:
        break;
    }

    // Respond with a success status
    return res.status(200).json({
      success: true,
      message: 'Webhook Received',
    });
  } catch (error) {
    console.error('Error handling Clerk webhook:', error);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
