import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: String,
      ref: 'User',
      required: true,
    },
    room: {
      type: String,
      ref: 'Room',
      required: true,
    },
    hotel: {
      type: String,
      ref: 'Hotel',
      required: true,
    },
    checkInDate: {
      type: String,
      required: true,
    },
    checkOutDate: {
      type: String,
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    guests: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled'],
      default: 'pending',
    },

    paymentMethod: {
      type: String,
      required: true,
      default: 'Pay At Hotel',
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const BookingModel = mongoose.model('Booking', bookingSchema);

export default BookingModel;
