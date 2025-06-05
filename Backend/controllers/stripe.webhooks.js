import stripe from 'stripe';
import BookingModel from '../models/bookings.model.js';

// API to handle Stripe Webhooks
export const stripeWebHooks = async (req, res) => {
  // Stripe Gateway Initialize
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

  const stripeInstance = new stripe(stripeSecretKey);
  const sig = req.headers['stripe-signature'];
  let event;
  try {
    event = stripeInstance.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.log('Error constructing Stripe event:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object;
    const paymentIntentId = paymentIntent.id;

    // Getting Session Metadata
    const session = await stripeInstance.checkout.sessions.list({
      payment_intent: paymentIntentId,
    });

    const { bookingId } = session.data[0].metadata;

    // Update booking status to 'paid'
    await BookingModel.findByIdAndUpdate(bookingId, {
      isPaid: true,
      paymentMethod: 'stripe',
    });
  } else {
    console.log(`Unhandled event type ${event.type}`);
  }
  // Return a response to acknowledge receipt of the event
  res.status(200).json({ received: true });
};
