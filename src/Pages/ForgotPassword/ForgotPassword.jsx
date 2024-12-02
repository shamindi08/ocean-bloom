import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './ForgotPassword.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState('');
  const navigate = useNavigate();  


  const handleResetPasswordLink = () => {
    // Navigate to the Reset Password page with the token
    if (token) {
      navigate(`/reset-password/${token}`);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5050/api/forgot-password', { email });
  
      if (response.status === 200) {
        setMessage('Password reset email has been sent! Check your inbox.');
       
        const tokenFromBackend = response.data.token; // Make sure the backend response includes this token
        setToken(tokenFromBackend);
      } else {
        setError('Failed to send reset email. Please try again later.');
      }
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setError('Email not found. Please try again.');
      } else {
        setError('Something went wrong. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password-container">
      <h2>Forgot Password</h2>
      <form onSubmit={handleForgotPassword} className="forgot-password-form">
        <div className="input-group">
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {message && <p className="success-message">{message}</p>}
        {error && <p className="error-message">{error}</p>}

        <button type="submit" className="submit-button" disabled={loading}>
          {loading ? 'Sending...' : 'Send Reset Link'}
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;
