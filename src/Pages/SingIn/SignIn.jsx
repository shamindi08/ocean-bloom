import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import validator from 'validator';
import './SignIn.css';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const validateEmail = (email) => {
    return validator.isEmail(email); // Validate email format using validator library
  };

  const validatePassword = (password) => {
    return password.length >= 8; // You can expand this to include other criteria if needed.
  };

  const validateOtp = (otp) => {
    return otp.length === 6; // Assuming OTP is 6 digits
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validate inputs
    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      setLoading(false);
      return;
    }

    if (!validatePassword(password)) {
      setError('Password must be at least 8 characters long.');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('http://localhost:5050/api/signin', {
        email,
        password,
      });

      if (response.data === "OTP sent to your email. Please verify.") {
        setIsOtpSent(true);
        setSuccessMessage('OTP sent to your email. Please enter it to continue.');
      } else {
        setError('An error occurred. Please try again.');
      }
      
    } catch (err) {
      setError(err.response ? err.response.data.message : 'Error during sign-in. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpVerification = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
  
    if (!validateOtp(otp)) {
      setError('Please enter a valid OTP.');
      setLoading(false);
      return;
    }
  
    try {
      const response = await axios.post('http://localhost:5050/api/verify-otp', {
        email,
        otp,
      });
  
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        setSuccessMessage('OTP verified successfully.');
  
        if (email === 'shamindigovipothage2021@gmail.com') {
          navigate('/admin-dashboard');
        } else {
          navigate('/customer-dashboard');
        }
      } else {
        setError('OTP verification failed. Please try again.');
      }
    } catch (err) {
      setError(err.response ? err.response.data.message : 'Error verifying OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  

  const handleForgotPassword = () => {
    navigate('/forgot-password');
  };

  const handleRegisterRedirect = () => {
    navigate('/signup');
  };

  return (
    <div className="signin-container">
      <h2>Ocean Bloom - Sign In</h2>

      {/* Step 1: Email and Password Form */}
      {!isOtpSent && (
        <form onSubmit={handleSignIn} className="signin-form">
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <p className="error-message">{error}</p>}
          {successMessage && <p className="success-message">{successMessage}</p>}

          <button type="submit" className="signin-button" disabled={loading}>
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
      )}

      {/* Step 2: OTP Form */}
      {isOtpSent && (
        <form onSubmit={handleOtpVerification} className="otp-form">
          <div className="input-group">
            <label htmlFor="otp">Enter OTP</label>
            <input
              type="text"
              id="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
          </div>

          {error && <p className="error-message">{error}</p>}
          {successMessage && <p className="success-message">{successMessage}</p>}

          <button type="submit" className="otp-button" disabled={loading}>
            {loading ? 'Verifying...' : 'Verify OTP'}
          </button>
        </form>
      )}

      <button onClick={handleForgotPassword} className="forgot-button">
        Forgot Password?
      </button>

      <p>
        Don't have an account? <button onClick={handleRegisterRedirect} className="register-here-button">Register here</button>
      </p>
    </div>
  );
};

export default SignIn;