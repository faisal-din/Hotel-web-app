import React, { useEffect, useState } from 'react';
import Title from '../../Components/Title';
import { assets } from '../../assets/assets';
import { useAppContext } from '../../Context/AppContext';
import axios from 'axios';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user, getToken, currency } = useAppContext();

  const [dashboardData, setDashboardData] = useState({
    bookings: [],
    totalBookings: 0,
    totalRevenue: 0,
  });

  const fetchDashboardData = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get('/api/bookings/hotel', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (data.success) {
        setDashboardData(data.dashboardData);
      } else {
        toast.error(data.message || 'Failed to fetch dashboard data');
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error(error.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  return (
    <div>
      <Title
        align='left'
        font='outfit'
        title='Dashboard'
        subTitle='Monitor your room listings, track bookngs and analyze revenue, all in one place. Stay updated with real-time insights to ensure smooth operations. '
      />

      <div className='flex gap-4 my-8'>
        {/* --------- Total Bookings --------- */}
        <div className='bg-[#2563eb]/20 border border-[#2563eb]/10 rounded flex p-4 pr-8'>
          <img
            src={assets.totalBookingIcon}
            alt='total booking'
            className='max-sm:hidden h-10'
          />

          <div className='flex flex-col sm:ml-4 font-medium '>
            <p className='text-blue-500 text-lg'>Total Bookings</p>
            <p className='text-neutral-400 text-base'>
              {dashboardData.totalBookings}
            </p>
          </div>
        </div>

        {/* --------- Total Revenue --------- */}
        <div className='bg-[#2563eb]/20 border border-[#2563eb]/10 rounded flex p-4 pr-8'>
          <img
            src={assets.totalRevenueIcon}
            alt='total Revenue'
            className='max-sm:hidden h-10'
          />
          <div className='flex flex-col sm:ml-4 font-medium '>
            <p className='text-blue-500 text-lg'>Total Revenue</p>
            <p className='text-neutral-400 text-base'>
              {currency} {dashboardData.totalRevenue}
            </p>
          </div>
        </div>
      </div>
      {/* Recent Bookings */}
      <h2 className='text-xl text-blue-950/70 font-medium mb-5'>
        Recent Bookings
      </h2>

      <div className='w-full max-w-3xl text-left border border-gray-300 rounded max-h-80 overflow-y-scroll '>
        <table className='w-full'>
          <thead className='bg-gray-50'>
            <tr>
              <th className='py-3 px-4 text-gray-800 font-medium'>User Name</th>
              <th className='py-3 px-4 text-gray-800 font-medium max-sm:hidden'>
                Room Name
              </th>
              <th className='py-3 px-4 text-gray-800 font-medium text-center'>
                Total Amount
              </th>
              <th className='py-3 px-4 text-gray-800 font-medium text-center'>
                Payment Status
              </th>
            </tr>
          </thead>

          <tbody className='text-sm'>
            {dashboardData.bookings.map((item, index) => (
              <tr key={index}>
                <td className='py-3 px-4 text-gray-800 border-t border-gray-300 '>
                  {item.user.username}
                </td>
                <td className='py-3 px-4 text-gray-800 border-t border-gray-300  max-sm:hidden'>
                  {item.room.roomType}
                </td>
                <td className='py-3 px-4 text-gray-800 border-t border-gray-300 text-center '>
                  {currency}
                  {item.totalPrice}
                </td>
                <td className='py-3 px-4 text-gray-800 border-t border-gray-300 text-center '>
                  <button
                    className={`py-1 px-3 text-xs rounded-full mx-auto ${
                      item.isPaid
                        ? 'bg-green-200 text-green-600'
                        : 'bg-amber-200 text-yellow-600'
                    }`}
                  >
                    {item.isPaid ? 'Completed' : 'Pending'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* end */}
    </div>
  );
};

export default Dashboard;
