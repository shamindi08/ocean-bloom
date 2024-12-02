import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import zxcvbn from 'zxcvbn';
import axios from 'axios';
import './SignUp.css';

const SignUp = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    
    const [error, setError] = useState('');
    
    const [passwordStrength, setPasswordStrength] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Handle form submission
    const handleSignUp = async (e) => {
        e.preventDefault();
        setError('');

        // Check if all are filled
        if (!username || !password || !email) {
            setError('All fields are required.');
            return;
        }

        // Validate password strength
        if (passwordStrength && passwordStrength.score < 2) {
            setError('Password strength is too weak.');
            return;
        }

        // Start loading
        setLoading(true);

        try {
            // Send signup request to backend
            const response = await axios.post('http://localhost:5050/api/signup', {
                name: username,
                email: email,
                password: password,
            });

            // If signup is successful, redirect to signin page
            if (response.status === 201) {
                alert('User signed up successfully! Please check your email for verification.');
                setUsername('');
                setPassword('');
                setEmail('');
                setPasswordStrength(null);
                
                navigate('/signin');
            } else {
                setError(response.data.message || 'Something went wrong, please try again.');
            }
        } catch (err) {
            // Catch errors (e.g., CORS issues or other backend issues)
            if (err.response) {
                // Server responded with a status other than 2xx
                setError(err.response.data || 'Failed to sign up, please try again later.');
            } else {
                // Network error
                setError('Network error, please try again later.');
            }
        } finally {
            setLoading(false);
        }
    };

    // Handle password input changes
    const handlePasswordChange = (e) => {
        const newPassword = e.target.value;
        setPassword(newPassword);

        // Calculate password strength using zxcvbn
        const result = zxcvbn(newPassword);
        setPasswordStrength(result);
    };

    // Redirect to login page
    const handleLoginRedirect = () => {
        navigate('/signin');
    };

    return (
        <div className="signup-container">
            <h2>Ocean Bloom - Sign Up</h2>
            <form onSubmit={handleSignUp} className="signup-form">
                <div className="input-group">
                    <label htmlFor="username">Username</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
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
                        onChange={handlePasswordChange}
                        required
                    />
                </div>

                {passwordStrength && (
                    <div className="password-strength">
                        <p>
                            Password strength:{" "}
                            {passwordStrength.score === 0
                                ? "Very Weak"
                                : passwordStrength.score === 1
                                ? "Weak"
                                : passwordStrength.score === 2
                                ? "Fair"
                                : passwordStrength.score === 3
                                ? "Good"
                                : "Strong"}
                        </p>
                    </div>
                )}

                {error && <p className="error-message">{error}</p>}
                <button type="submit" disabled={loading}>
                    {loading ? 'Signing Up...' : 'Sign Up'}
                </button>
            </form>
            <p>
                Already have an account?{" "}
                <span onClick={handleLoginRedirect} className="login-link">
                    Sign In
                </span>
            </p>
        </div>
    );
};

export default SignUp;
