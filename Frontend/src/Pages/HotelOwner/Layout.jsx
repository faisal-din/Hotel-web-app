import React, { useEffect } from 'react';
import Navbar from '../../Components/HotelOwner/Navbar';
import Sidebar from '../../Components/HotelOwner/Sidebar';
import { Outlet } from 'react-router-dom';
import { useAppContext } from '../../Context/AppContext';

const Layout = () => {
  const { isOwner, navigate } = useAppContext();

  useEffect(() => {
    if (!isOwner) {
      navigate('/');
    }
  }, [isOwner]);
  return (
    <div className='flex flex-col min-h-screen'>
      <Navbar />
      <div className='flex '>
        <Sidebar />
        <div className='flex p-4 pt-10 md:px-10 '>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
