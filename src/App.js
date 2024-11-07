// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import SignIn from './Pages/SingIn/SignIn';
import SignUp from './Pages/SignUp/SignUp';


import './App.css'; // Import your main CSS if you have one
import AdminDashboard from './Pages/AdminDashboard/AdminDashboard';
import Customers from './Pages/Customers/Customers';
import UserDashboard from './Pages/UserDashboard/UserDashboard';
import ResetPassword from './Pages/ResetPassword/ResetPassword';
import ForgotPassword from './Pages/ForgotPassword/ForgotPassword';
import AdminSignIn from './Pages/AdminSignIn/AdminSignIn';
import AdminSignUp from './Pages/AdminSignUP/AdminSignUp';
import UserProfile from './Pages/UserProfile/UserProfile';



const App = () => {
  return (
    <Router>
       {/* Add the NavBar component */}
      <Routes>
        
        <Route path="/signup" element={<SignUp />} /> {/* Sign Up route */}
        <Route path="/" element={<SignIn />} /> {/* Sign In route */}
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        
        <Route path="/new-arrivals" element={<div>New Arrivals Page</div>} />
        <Route path="/men" element={<div>Men's Section</div>} />
        <Route path="/women" element={<div>Women's Section</div>} />
        <Route path="/customers" element={<Customers/>} /> 
        <Route path="/customer-dashboard" element={<UserDashboard/>} /> 
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/admin-signin" element={<AdminSignIn />} />
        <Route path="/admin-signup" element={<AdminSignUp />} />
        <Route path="/profile" element={<UserProfile />} />
       
      </Routes>
    </Router>
  );
};

export default App;
