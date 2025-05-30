import React from 'react';
import './App.css';
import Navbar from './Components/Navbar';
import { Route, Routes, useLocation } from 'react-router-dom';
import Home from './Pages/Home';
import Footer from './Components/Footer';
import AllRooms from './Pages/AllRooms';

function App() {
  const isOwnerPath = useLocation().pathname.includes('owner');

  return (
    <>
      {!isOwnerPath && <Navbar />}

      <div className='min-h-[70vh]'>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/rooms' element={<AllRooms />} />
          <Route path='/rooms/:id' element={<h1>Owner Login Page</h1>} />
        </Routes>
      </div>

      <Footer />
    </>
  );
}

export default App;
