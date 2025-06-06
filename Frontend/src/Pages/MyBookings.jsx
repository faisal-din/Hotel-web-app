import React, { useState } from 'react';
import Title from '../Components/Title';
import { assets, userBookingsDummyData } from '../assets/assets';
import { useAppContext } from '../Context/AppContext';
import axios from 'axios';
import { useEffect } from 'react';
import toast from 'react-hot-toast';

const MyBookings = () => {
  const [bookings, setBookings] = useState(userBookingsDummyData);

  const { getToken, user } = useAppContext();

  const fetchUserBookings = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get('/api/bookings/user', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (data.success) {
        setBookings(data.bookings);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const hanldeStripePayment = async (bookingId) => {
    try {
      const token = await getToken();
      const { data } = await axios.post(
        '/api/bookings/stripe-payment',
        { bookingId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data.success) {
        window.location.href = data.url;
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error('Error proccessing payment:', error.response);
      toast.error(error.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    if (user) {
      fetchUserBookings();
    }
  }, [user]);

  return (
    <div className='py-28 md:pb-35 md:pt-32 px-4 md:px-16 1g:px-24 x1:px-32'>
      <Title
        title='My Bookings'
        subTitle='Easily manage your past, current, and upcoming hotel reservations in one place. Plan your trips seamlessly with just a few clicks'
        align='left'
      />

      <div className='max-w-6xl mt-8 w-full text-gray-800'>
        <div className='hidden md:grid md:grid-cols-[3fr_2fr_1fr] w-full border-b border-gray-300 font-medium text-base py-3'>
          <div className='w-1/3'>Hotels</div>
          <div className='w-1/3'>Date & timings</div>
          <div className='w-1/3'>Payment</div>
        </div>

        <div className='mt-4'>
          {bookings.map((booking) => (
            <div
              key={booking._id}
              className='grid grid-cols-1 md:grid-cols-[3fr_2fr_1fr] w-full border-b border-gray-300 py-6 first:border-t'
            >
              {/*  ------ Hotel Details ------  */}
              <div className='flex flex-col md:flex-row  gap-4 '>
                <img
                  src={booking.room.images[0]}
                  alt='Hotel image'
                  className='w-full md:w-44 rounded shadow  object-cover '
                />
                <div className='flex flex-col gap-1.5 max-md:mt-3 min-md:ml-4'>
                  <p className=' font-playfair text-2xl   '>
                    {booking.hotel.name}
                    <span className='text-sm font-inter ml-1 '>
                      ({booking.room.roomType})
                    </span>
                  </p>

                  <div className='flex items-center gap-2 text-gray-600 text-sm'>
                    <img src={assets.locationIcon} alt='Location Icon' />
                    <span>{booking.hotel.address}</span>
                  </div>

                  <div className='flex items-center gap-2 text-gray-600 text-sm'>
                    <img src={assets.guestsIcon} alt='Guest Icon' />
                    <span> Guests: {booking.guests}</span>
                  </div>
                  <p className='text-base'>Total: ${booking.totalPrice}</p>
                </div>
              </div>
              {/*  ------ Date & Timings ------  */}
              <div className='flex flex-row md:items-center md:gap-12 mt-3 gap-8'>
                <div>
                  <p>Check-In:</p>
                  <p className='className="text-gray-500 text-sm"'>
                    {new Date(booking.checkInDate).toDateString()}
                  </p>
                </div>
                <div>
                  <p>Check-Out:</p>
                  <p className='className="text-gray-500 text-sm"'>
                    {new Date(booking.checkOutDate).toDateString()}
                  </p>
                </div>
              </div>
              {/*  ------ Payment Status ------  */}
              <div className='flex flex-col items-start justify-center pt-3'>
                <div className='flex items-center gap-2'>
                  <div
                    className={`w-3 h-3 rounded-full ${
                      booking.isPaid ? 'bg-green-500' : 'bg-red-500'
                    }`}
                  ></div>
                  <p
                    className={`text-sm ${
                      booking.isPaid ? 'text-green-500' : 'text-red-500'
                    }`}
                  >
                    {booking.isPaid ? 'Paid' : 'UnPaid'}
                  </p>
                </div>
                {!booking.isPaid && (
                  <button
                    onClick={() => hanldeStripePayment(booking._id)}
                    className='px-4 py-1.5 mt-4 text-xs border border-gray-400 rounded-full hover:bg-gray-50 transition-all cursor-pointer'
                  >
                    Pay Now
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyBookings;
