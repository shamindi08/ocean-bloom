import React, { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import axios from 'axios';
import './ResetPassword.css';

const ResetPassword = () => {
  const { token } = useParams();  // Extract reset token from URL
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [redirect, setRedirect] = useState(false);  // State to control redirection

  useEffect(() => {
    if (!token) {
      setError('No reset token found.');
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation: check if passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match!');
      return;
    }

    try {
      // Send the new password along with the reset token to your backend
      await axios.post(`/api/reset-password/${token}`, { password });

      // Handle success
      setSuccess(true);
      alert('Password reset successful!');

      // Set the redirect flag to true
      setTimeout(() => {
        setRedirect(true);
      }, 2000);
    } catch (err) {
      // Handle error
      setError(err.response ? err.response.data.message : 'Something went wrong');
    }
  };

  if (redirect) {
    return <Navigate to="/signin" />;  // Redirect the user to the login page after success
  }

  return (
    <div>
      <h2>Reset Your Password</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>Password reset successful. Redirecting...</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="password">New Password:</label>
          <input
            type="password"
            id="password"
            placeholder="Enter your new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="confirmPassword">Confirm New Password:</label>
          <input
            type="password"
            id="confirmPassword"
            placeholder="Confirm your new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit">Reset Password</button>
      </form>
    </div>
  );
};

export default ResetPassword;
