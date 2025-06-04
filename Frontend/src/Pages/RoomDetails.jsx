import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { assets, facilityIcons, roomCommonData } from '../assets/assets';
import StarRating from '../Components/StarRating';
import { useAppContext } from '../Context/AppContext';
import toast from 'react-hot-toast';
import axios from 'axios';

const RoomDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [room, setRoom] = useState(null);
  const [mainImage, setmainImage] = useState(null);
  const [checkInDate, setCheckInDate] = useState(null);
  const [checkOutDate, setCheckOutDate] = useState(null);
  const [guests, setGuests] = useState(1);
  const [isAvailable, setIsAvailable] = useState(false);

  const { rooms, getToken } = useAppContext();

  // Check if the Room is Available
  const checkAvailablity = async () => {
    try {
      // check if Check-In-Date is greater than Check-Out-Date
      if (checkInDate >= checkOutDate) {
        toast.error('Check-In-Date should be less than Check-Out-Date');
        return;
      }

      const { data } = await axios.post('/api/bookings/check-availablity', {
        room: id,
        checkInDate,
        checkOutDate,
      });

      if (data.success) {
        if (data.isAvailable) {
          setIsAvailable(true);
          toast.success('Room is Available');
        } else {
          setIsAvailable(false);
          toast.error('Room is not Available');
        }
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log('Error in check-availablity', error.response);
      toast.error(error.response?.data?.message || error.message);
    }
  };

  // onSubmitHandler function to check availability and book the room (if available else just check availability and show the message)
  const onSubmitHandler = async (e) => {
    try {
      e.preventDefault();

      if (!isAvailable) {
        return checkAvailablity();
      } else {
        const token = await getToken();

        const { data } = await axios.post(
          '/api/bookings/book',
          {
            room: id,
            checkInDate,
            checkOutDate,
            guests,
            paymentMethod: 'Pay At Hotel',
          },

          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log('Booking Response:', data);
        if (data.success) {
          toast.success(data.message);
          navigate('/my-bookings');
          scrollTo(0, 0);
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      console.log('Error in booking room:', error.response);
      toast.error(error.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    const room = rooms.find((room) => room._id === id);
    room && setRoom(room);
    room && setmainImage(room.images[0]);
  }, [rooms]);

  return (
    room && (
      <div className='py-28 md:py-35 px-4 md:px-16 lg:px-24 xl:px-32'>
        {/* Room Details */}
        <div className='flex flex-col md:flex-row items-start md:items-center gap-2'>
          <h1 className='text-3xl md:text-4xl font-playfair'>
            {room.hotel.name}{' '}
            <span className='font-inter text-sm'>({room.roomType})</span>
          </h1>
          <p className='text-xs font-inter py-1.5 px-3 text-white bg-orange-500  rounded-full'>
            20% OFF
          </p>
        </div>

        {/* Room Rating */}
        <div className='flex items-center gap-1 mt-2'>
          <StarRating />
          <div className='ml-2'>200+ reviews</div>
        </div>

        {/* Room Address */}
        <div className='flex items-center gap-1 text-gray-500 mt-2'>
          <img src={assets.locationIcon} alt='location-icon' />
          <span>{room.hotel.address}</span>
        </div>

        {/* Room Images */}
        <div className='flex flex-col lg:flex-row mt-6 gap-6'>
          {/* Main Image */}
          <div className='lg:w-1/2 w-full'>
            <img
              src={mainImage}
              alt='room image'
              className='w-full rounded-xl shadow-xl object-cover'
            />
          </div>

          {/* other images */}

          <div className='grid grid-cols-2 gap-4 lg:w-1/2 w-full'>
            {room?.images.length > 1 &&
              room.images.map((image, index) => (
                <img
                  onClick={() => setmainImage(image)}
                  src={image}
                  alt='room image'
                  key={index}
                  className={`w-full rounded-xl shadow-md object-cover cursor-pointer ${
                    mainImage === image && 'border-2 border-orange-500'
                  }`}
                />
              ))}
          </div>
        </div>

        {/* Room Highlight */}

        <div className='flex flex-col md:flex-row md:justify-between mt-10'>
          <div className='flex flex-col'>
            <h1 className='text-3xl md:text-4xl font-playfair'>
              Experience Luxury Like Never Before
            </h1>

            <div className='flex flex-wrap items-center mt-3 mb-6 gap-4'>
              {room.amenities.map((item, index) => (
                <div
                  key={index}
                  className='flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100'
                >
                  <img
                    src={facilityIcons[item]}
                    alt={item}
                    className='w-5 h-5'
                  />
                  <p className='text-xs'>{item}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Room Price */}
          <p className='text-2xl font-medium'>${room.pricePerNight}/night</p>
        </div>

        {/* Check-in Check-out Form */}
        <form
          onSubmit={onSubmitHandler}
          className='flex flex-col md:flex-row items-start md:items-center justify-between bg-white shadow-[0px_0px_20px_rgba(0,0,0,0.15)] p-6 rounded-xl mx-auto mt-16 max-w-6xl'
        >
          <div className='flex flex-col flex-wrap md:flex-row items-start md:items-center gap-4 md:gap-10 text-gray-500'>
            <div className='flex flex-col'>
              <label htmlFor='checkInDate' className='font-medium'>
                Check-In
              </label>
              <input
                onChange={(e) => setCheckInDate(e.target.value)}
                min={new Date().toISOString().split('T'[0])}
                type='date'
                id='checkInDate'
                placeholder='Check-In'
                className='w-full rounded border border-gray-300 px-3 py-2 mt-1.5 outline-none'
                required
              />
            </div>
            <div className='w-px h-16 bg-gray-300/70 max-md:hidden '></div>

            <div className='flex flex-col'>
              <label htmlFor='checkOutDate' className='font-medium'>
                Check-Out
              </label>
              <input
                onChange={(e) => setCheckOutDate(e.target.value)}
                min={checkInDate}
                disabled={!checkInDate}
                type='date'
                id='checkOutDate'
                placeholder='Check-Out'
                className='w-full rounded border border-gray-300 px-3 py-2 mt-1.5 outline-none'
                required
              />
            </div>

            <div className='w-px h-16 bg-gray-300/70 max-md:hidden '></div>

            <div className='flex flex-col'>
              <label htmlFor='guests' className='font-medium'>
                Guests
              </label>
              <input
                onChange={(e) => setGuests(e.target.value)}
                value={guests}
                type='number'
                id='guests'
                placeholder='1'
                className='max-w-20 rounded border border-gray-300 px-3 py-2 mt-1.5 outline-none'
                required
              />
            </div>
          </div>
          <button
            type='submit'
            className='bg-[#2563eb] hover:bg-primary-dull active:scale-95 transition-all text-white rounded-md max-md:w-full max-md:mt-6 md:px-24 py-3 md:py-4 text-base cursor-pointer'
          >
            {isAvailable ? 'Book Now' : 'Check Availablity'}
          </button>
        </form>

        {/* Common Specifications */}

        <div className='flex flex-col  gap-4 mt-16'>
          {roomCommonData.map((spec, index) => (
            <div key={index} className=' flex items-start gap-2'>
              <img src={spec.icon} alt={`${spec.title}-icon`} className='w-6' />
              <div>
                <div className='text-base'>{spec.title}</div>
                <div className='text-gray-500'>{spec.description}</div>
              </div>
            </div>
          ))}
        </div>

        {/*  */}

        <div className='max-w-3xl border-y border-gray-300 my-14 py-10 text-gray-500'>
          <p>
            Guests will be allocated on the ground floor according to
            availability. You get a comfortable Two bedroom apartment has a true
            city feeling. The price quoted is for two guest, at the guest slot
            please mark the number of guests to get the exact price for groups.
            The Guests will be allocated ground floor according to availability.
            You get the comfortable two bedroom apartment that has a true city
            feeling.
          </p>
        </div>

        {/* Hosted By */}
        <div className='flex flex-col items-start gap-4'>
          <div className='flex items-center gap-4'>
            <img
              src={room.hotel.owner.image}
              alt='Host'
              className='h-14 w-14 md:h-18 md:w-18 rounded-full'
            />

            <div>
              <p className='text-lg md:text-xl'>Hosted by {room.hotel.name}</p>
              <div className='flex items-center gap-1 mt-1'>
                <StarRating />
                <div className='ml-2'>200+ reviews</div>
              </div>
            </div>
          </div>

          <button
            button
            className='px-6 py-2.5 mt-4 rounded text-white bg-[#2563eb]  hover:bg-primary-dull transition-all cursor-pointer'
          >
            Contact Now
          </button>
        </div>

        {/* end */}
      </div>
    )
  );
};

export default RoomDetails;
