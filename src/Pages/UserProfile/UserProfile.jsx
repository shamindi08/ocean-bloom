import React, { useState, useEffect } from 'react';
import { Container, TextField, Button, Typography } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './UserProfile.css'

const UserProfile = () => {
    // Initialize state with empty strings to prevent uncontrolled-to-controlled component error
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await axios.get('http://localhost:5050/api/user/profile', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                setUsername(response.data.username || ''); // Ensure username is not undefined
            } catch (err) {
                console.error("Profile fetch error:", err.response ? err.response.data : err.message);
                setError('Failed to load user data.');
            }
        };

        fetchUserProfile();
    }, []);

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await axios.put('http://localhost:5050/api/user/profile', {
                username,
                password,
                newPassword,
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            if (response.status === 200) {
                alert('Profile updated successfully!');
                navigate('/customer-dashboard'); // Redirect after success
            }
        } catch (err) {
            setError(err.response ? err.response.data.message : 'Failed to update profile.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="sm">
            <Typography variant="h4" component="h1" gutterBottom align="center">
                Manage Profile
            </Typography>
            <form onSubmit={handleUpdateProfile}>
                <TextField
                    label="Username"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <TextField
                    label="Current Password"
                    type="password"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <TextField
                    label="New Password"
                    type="password"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                />
                {error && <p className="error-message">{error}</p>}
                <Button type="submit" variant="contained" color="primary" disabled={loading}>
                    {loading ? 'Updating...' : 'Update Profile'}
                </Button>
            </form>
        </Container>
    );
};

export default UserProfile;
