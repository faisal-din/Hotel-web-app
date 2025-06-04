import RoomModel from '../models/room.model.js';
import BookingModel from '../models/bookings.model.js';
import HotelModel from '../models/hotel.model.js';
import transporter from '../config/nodemailer.js';

// Function to Check Availablity of Room
const checkAvailablity = async ({ checkInDate, checkOutDate, room }) => {
  try {
    const bookings = await BookingModel.find({
      room,
      checkInDate: { $lte: checkOutDate },
      checkOutDate: { $gte: checkInDate },
    });

    const isAvailable = bookings.length === 0;
    return isAvailable;
  } catch (error) {
    console.log('Error Checking Availablity', error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// API To Check Availablity of Room
// POST  /api/bookings/check-availablity
export const checkAvailablityAPI = async (req, res) => {
  try {
    const { checkInDate, checkOutDate, room } = req.body;

    const isAvailable = await checkAvailablity({
      checkInDate,
      checkOutDate,
      room,
    });

    res.status(201).json({
      success: true,
      isAvailable,
    });
  } catch (error) {
    console.log('Error Checking Availablity', error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// API To Create a new booking
// POST  /api/bookings/book

export const createBooking = async (req, res) => {
  try {
    const { checkInDate, checkOutDate, guests, room } = req.body;
    const user = req.user._id;

    // Before booking check availability
    const isAvailable = await checkAvailablity({
      checkInDate,
      checkOutDate,
      room,
    });

    if (!isAvailable) {
      return res.status(400).json({
        success: false,
        message: 'Room is not available',
      });
    }

    // Get total price from the room details
    const roomData = await RoomModel.findById(room).populate('hotel');
    const totalPrice = roomData.pricePerNight;

    // Calculate totalPrice based on nights
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const timeDifference = checkOut.getTime() - checkIn.getTime();
    const nights = Math.ceil(timeDifference / (1000 * 3600 * 24)); // Convert milliseconds to days

    const totalBookingPrice = totalPrice * nights;

    // Create a new booking
    const booking = await BookingModel.create({
      user,
      room,
      hotel: roomData.hotel._id,
      guests: +guests,
      checkInDate,
      checkOutDate,
      totalPrice: totalBookingPrice,
    });

    // Format date for email
    const formatDate = (date) => {
      return new Date(date).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    };

    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: req.user.email,
      subject: 'Hotel Booking Details',
      html: `
      <h2>Your Booking Details</h2>
      <p>Dear ${req.user.username},</p>
     <p>Thank you for your booking! Here are your details:</p>
     <ul>
        <li><strong>Booking ID: </strong> ${booking._id}</li>
        <li><strong>Hotel Name: </strong> ${roomData.hotel.name}</li>
        <li><strong>Location: </strong> ${roomData.hotel.address}</li>
        <li><strong>Check-In-Date: </strong> ${formatDate(
          booking.checkInDate
        )}</li>
        <li><strong>Check-Out-Date: </strong> ${formatDate(
          booking.checkOutDate
        )}</li>
        <li><strong>Booking Amount: </strong> $${
          booking.totalPrice
        }   /night</li>
     </ul>
     <p>We look forward to welcoming you!</p>
     <p>If you need to make any changes, feel free to contact us.</p>
      
      `,
    };

    // Send email to user
    try {
      await transporter.sendMail(mailOptions);

      return res.status(201).json({
        success: true,
        message: 'Booking created successfully and email sent',
        booking,
      });
    } catch (emailError) {
      console.error('Email sending failed:', emailError.message);

      // Still return success since booking was created
      return res.status(201).json({
        success: true,
        message:
          'Booking created successfully! (Confirmation email failed to send)',
        booking,
      });
    }
  } catch (error) {
    console.log('Error Creating Booking', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// API To get all bookings for a user
// GET  /api/bookings/user
export const getUserBookings = async (req, res) => {
  try {
    const userId = req.user._id;
    const bookings = await BookingModel.find({ user: userId })
      .populate('room hotel')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      bookings,
    });
  } catch (error) {
    console.log('Error Getting User Bookings', error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// API to  get
export const getHotelBookings = async (req, res) => {
  try {
    const hotel = await HotelModel.findOne({ owner: req.auth.userId });

    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: 'Hotel not found',
      });
    }

    const bookings = await BookingModel.find({ hotel: hotel._id })
      .populate('room user')
      .sort({ createdAt: -1 });

    // Total Bookings
    const totalBooking = bookings.length;

    // Total Revenue
    const totalRevenue = bookings.reduce((acc, booking) => {
      return acc + booking.totalPrice;
    }, 0);

    res.status(200).json({
      success: true,
      dashboardData: { bookings, totalBooking, totalRevenue },
    });
  } catch (error) {
    console.log('Error Getting Hotel Bookings', error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
