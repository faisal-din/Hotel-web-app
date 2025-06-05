import React from 'react';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const Loader = () => {
  const navigaye = useNavigate();
  const { nextUrl } = useParams();

  useEffect(() => {
    if (nextUrl) {
      setTimeout(() => {
        navigaye(`/${nextUrl}`);
      }, 8000);
    }
  }, [nextUrl]);

  return (
    <div className='flex justify-center items-center h-screen'>
      <div className='animate-spin rounded-full h-24 w-24 border-4 border-gray-300 border-t-blue-500'></div>
    </div>
  );
};

export default Loader;
