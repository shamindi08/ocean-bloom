import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


const Verify2FA = ({ tempToken }) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Verify the code
      const response = await axios.post('http://localhost:5050/api/verify-code', { code, tempToken });

      if (response.data.token) {
        localStorage.setItem('token', response.data.token); // Store the final auth token
        navigate('/customer-dashboard'); // Redirect to the dashboard
      } else {
        setError('Invalid code. Please try again.');
      }
    } catch (err) {
      setError('Verification failed. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="verify-2fa-container">
      <h2>Verify Your Code</h2>
      <form onSubmit={handleVerifyCode} className="verify-2fa-form">
        <div className="input-group">
          <label htmlFor="code">Enter Verification Code</label>
          <input
            type="text"
            id="code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
          />
        </div>
        {error && <p className="error-message">{error}</p>}
        <button type="submit" className="verify-2fa-button" disabled={loading}>
          {loading ? 'Verifying...' : 'Verify'}
        </button>
      </form>
    </div>
  );
};

export default Verify2FA;
