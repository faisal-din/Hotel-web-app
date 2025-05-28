import React from 'react';
import './App.css';
import Navbar from './Components/Navbar';
import { Route, Routes, useLocation } from 'react-router-dom';
import Home from './Pages/Home';

function App() {
  const isOwnerPath = useLocation().pathname.includes('owner');

  return (
    <>
      {!isOwnerPath && <Navbar />}

      <div className='min-h-[70vh]'>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/owner' element={<h1>Owner Page</h1>} />
          <Route path='/owner/login' element={<h1>Owner Login Page</h1>} />
          <Route path='/owner/signup' element={<h1>Owner Signup Page</h1>} />
          <Route path='/user' element={<h1>User Page</h1>} />
          <Route path='/user/login' element={<h1>User Login Page</h1>} />
          <Route path='/user/signup' element={<h1>User Signup Page</h1>} />
        </Routes>
      </div>
    </>
  );
}

export default App;
