import HotelModel from '../models/hotel.model.js';
import RoomModel from '../models/room.model.js';
import { v2 as cloudinary } from 'cloudinary';

// API to create a new room for a hotel
export const createRoom = async (req, res) => {
  try {
    const { roomType, pricePerNight, amenities } = req.body;

    const hotel = await HotelModel.findById({ owner: req.auth.userId });

    if (!hotel) {
      return res.status(201).json({
        success: false,
        message: 'Hotel not found',
      });
    }

    // upload the room image to Cloudinary
    const uploadedImages = req.files.map(async (file) => {
      const response = await cloudinary.uploader.upload(file.path, {
        folder: 'rooms',
      });
      return response.secure_url;
    });

    // Wait for all images to be uploaded
    const images = await Promise.all(uploadedImages);

    await RoomModel.create({
      hotel: hotel._id,
      roomType,
      pricePerNight: +pricePerNight,
      amenities: JSON.parse(amenities),
      images,
    });

    res.status(201).json({
      success: true,
      message: 'Room created successfully',
    });
  } catch (error) {
    console.error('Error creating room:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// API to get all rooms
export const getRooms = async (req, res) => {};

// API to get all rooms for a specific hotel
export const getAllRooms = async (req, res) => {};

// API to toggle room availability
export const toggleRoomAvailability = async (req, res) => {
  try {
    const { roomId } = req.params;
    const { available } = req.body;

    // Find the room by ID
    const room = await RoomModel.findById(roomId);
    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found',
      });
    }

    // Update the availability status
    room.available = available;
    await room.save();

    res.status(200).json({
      success: true,
      message: 'Room availability updated successfully',
      room,
    });
  } catch (error) {
    console.error('Error toggling room availability:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
