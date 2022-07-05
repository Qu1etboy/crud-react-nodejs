import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom'; 
import axios from 'axios';
import './App.css';
import RegisterLogin from './registerLogin';
import Posts from './posts';
import Navbar from './components/navbar';
import Footer from './components/footer';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path='/' element={<RegisterLogin />}/>
        <Route path='/posts' element={<Posts />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
