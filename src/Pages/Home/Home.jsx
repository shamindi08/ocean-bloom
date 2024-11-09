// src/components/Home.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css'; // Import the CSS file

const Home = () => {
  return (
    <div className="home-container">
      <h1 className="home-title">Welcome to OceanBloom</h1>
      <p className="home-subtitle">
      Your ultimate destination for gaming news, reviews, and immersive experiences.
      </p>

      <div className="button-container">
        <Link to="/signin">
          <button className="home-button">Sign In</button>
        </Link>
        <Link to="/signup">
          <button className="home-button">Sign Up</button>
        </Link>
      </div>
    </div>
  );
};

export default Home;
