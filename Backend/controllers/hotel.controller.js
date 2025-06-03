import HotelModel from '../models/hotel.model.js';
import UserModel from '../models/user.model.js';

export const registerHotel = async (req, res) => {
  try {
    const { name, address, contact, city } = req.body;
    const owner = req.user._id;

    // Check if the user is registered
    const hotel = await HotelModel.findOne({ owner });

    if (hotel) {
      return res.status(400).json({
        success: false,
        message: 'Hotel already registered.',
      });
    }

    // Create a new hotel instance
    const newHotel = {
      name,
      address,
      contact,
      city,
      owner: owner,
    };

    await HotelModel.create(newHotel);

    await UserModel.findByIdAndUpdate(
      owner,
      { role: 'hotelOwner' },
      { new: true }
    );

    res.status(201).json({
      success: true,
      message: 'Hotel registered successfully',
      hotel,
    });
  } catch (error) {
    console.error('Error registering hotel:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
