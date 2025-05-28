import React from 'react';
import './App.css';
import Navbar from './Components/Navbar';
import { useLocation } from 'react-router-dom';

function App() {
  const isOwnerPath = useLocation().pathname.includes('owner');

  return <>{!isOwnerPath && <Navbar />}</>;
}

export default App;
