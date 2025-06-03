import HotelModel from '../models/hotel.model.js';
import RoomModel from '../models/room.model.js';
import { v2 as cloudinary } from 'cloudinary';

// API to create a new room for a hotel
// POST --> /api/rooms/create
export const createRoom = async (req, res) => {
  try {
    const { roomType, pricePerNight, amenities } = req.body;

    const hotel = await HotelModel.findOne({ owner: req.auth.userId });

    if (!hotel) {
      return res.status(40).json({
        success: false,
        message: 'Hotel not found',
      });
    }

    // Upload images to Cloudinary
    const uploadedImages = await Promise.all(
      req.files.map(async (file) => {
        const response = await cloudinary.uploader.upload(file.path, {
          folder: 'rooms',
        });
        return response.secure_url;
      })
    );

    await RoomModel.create({
      hotel: hotel._id,
      roomType,
      pricePerNight: +pricePerNight,
      amenities: JSON.parse(amenities),
      images: uploadedImages,
    });

    res.status(201).json({
      success: true,
      message: 'Room created successfully',
    });
  } catch (error) {
    console.error('Error creating room:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// API to get all rooms
//  GET --> /api/rooms/
export const getAllRooms = async (req, res) => {
  try {
    const rooms = await RoomModel.find({ isAvailable: true })
      .populate({
        path: 'hotel',
        populate: {
          path: 'owner',
          select: 'image',
        },
      })
      .sort({ createdAt: -1 });

    res.status(201).json({
      success: true,
      rooms,
    });
  } catch (error) {
    console.log('Error Fetching Roooms', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// API to get all rooms for a specific hotel  ( GET --> /api/rooms/owner)
export const getOwnerRooms = async (req, res) => {
  try {
    const hotelData = await HotelModel({ owner: req.auth.userId });
    const rooms = await RoomModel.find({
      hotel: hotelData._id.toString(),
    }).populate('hotel');

    res.status(201).json({
      success: true,
      rooms,
    });
  } catch (error) {
    console.log('Error Fetching Owner Roooms', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// API to toggle room availability ( GET --> /api/rooms/toggle-availablity)
export const toggleRoomAvailability = async (req, res) => {
  try {
    const { roomId } = req.body;

    // Find the room by ID
    const roomData = await RoomModel.findById(roomId);

    if (!roomData) {
      return res.status(404).json({
        success: false,
        message: 'Room not found',
      });
    }

    // Update the availability status
    roomData.isAvailable = !roomData.isAvailable;
    await room.save();

    res.status(200).json({
      success: true,
      message: 'Room availability updated',
      room,
    });
  } catch (error) {
    console.error('Error toggling room availability:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
