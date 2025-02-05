// routes.jsx
import React from 'react';
import { Route , Routes} from 'react-router-dom';
import Booking from './../pages/Booking/Booking';
import Profile from '../pages/Profile/Profile';
import Login from '../pages/Auth/Login/Login';
import Register from '../pages/Auth/Register/Register';
import ForgotPassword from '../pages/Auth/ForgotPass/ForgotPassword';
import Map from '../pages/map/Map';



const RoutesConfig = () => {
  return (
    <Routes>
      <Route path="/booking" element={<Booking />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgotpass" element={<ForgotPassword />} />
      <Route path="/map" element={<Map/>} />
    </Routes>
  );
};

export default RoutesConfig;
