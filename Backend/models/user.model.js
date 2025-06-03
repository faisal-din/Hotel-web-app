import mongoose from 'mongoose';

const userSchema = mongoose.Schema(
  {
    _id: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      enum: ['user', 'hotelOwner'],
      default: 'user',
    },
    recentSearchedCities: [
      {
        type: String,
        required: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const UserModel = mongoose.model('User', userSchema);

export default UserModel;
