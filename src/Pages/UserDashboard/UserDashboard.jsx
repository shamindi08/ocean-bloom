import React, { useEffect } from 'react';
import { Container, Grid, Paper, Typography, Button } from '@mui/material';
import { Box } from '@mui/system';
import { Person, ShoppingCart, Settings, ExitToApp } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import './UserDashboard.css'; // Optional: Add your custom styles here
import axios from 'axios';
const UserDashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Function to verify the JWT token
    const verifyToken = async () => {
      const token = localStorage.getItem('token');
      
      // If no token found, redirect to login
      if (!token) {
        navigate('/');
        return;
      }

      try {
        // Make API call to verify the token
        const response = await axios.get('http://localhost:5050/api/user/verify-token', {
          headers: { Authorization: `Bearer ${token}` }
        });
      
        // If token is invalid, navigate to login
        if (response.status !== 200) {
          localStorage.removeItem('token'); // Remove any invalid token
          navigate('/');
        }
      } catch (error) {
        console.error('Token verification failed:', error);
        localStorage.removeItem('token'); // Remove invalid token on error
        navigate('/'); // Redirect to login
      }
      
    };

    verifyToken();
  }, [navigate]);

  // Handle logout functionality
  const handleLogout = () => {
    // Remove the token from localStorage (or sessionStorage)
    localStorage.removeItem('token');
    
    // Optionally, redirect the user to the login page after logout
    navigate('/');
  };

  return (
    <Container maxWidth="lg" className="user-dashboard">
      <Typography variant="h4" component="h1" gutterBottom align="center">
        User Dashboard
      </Typography>
      <Grid container spacing={4}>
        
        {/* View Profile Section */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} className="dashboard-section">
            <Box display="flex" flexDirection="column" alignItems="center" p={3}>
              <Person fontSize="large" className="icon" />
              <Typography variant="h6" component="h2">
                View Profile
              </Typography>
              <Link to="/profile">
                <Button variant="contained" color="primary" className="dashboard-button">
                  View Profile
                </Button>
              </Link>
            </Box>
          </Paper>
        </Grid>

        {/* Orders Section */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} className="dashboard-section">
            <Box display="flex" flexDirection="column" alignItems="center" p={3}>
              <ShoppingCart fontSize="large" className="icon" />
              <Typography variant="h6" component="h2">
                My Orders
              </Typography>
              <Link to="/orders">
                <Button variant="contained" color="primary" className="dashboard-button">
                  View Orders
                </Button>
              </Link>
            </Box>
          </Paper>
        </Grid>
        
        {/* Account Settings Section */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} className="dashboard-section">
            <Box display="flex" flexDirection="column" alignItems="center" p={3}>
              <Settings fontSize="large" className="icon" />
              <Typography variant="h6" component="h2">
                Account Settings
              </Typography>
              <Link to="/settings">
                <Button variant="contained" color="primary" className="dashboard-button">
                  Manage Settings
                </Button>
              </Link>
            </Box>
          </Paper>
        </Grid>

        {/* Manage Profile Section */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} className="dashboard-section">
            <Box display="flex" flexDirection="column" alignItems="center" p={3}>
              <Person fontSize="large" className="icon" />
              <Typography variant="h6" component="h2">
                Manage Profile
              </Typography>
              <Link to="/profile">
                <Button variant="contained" color="primary" className="dashboard-button">
                  Edit Profile
                </Button>
              </Link>
            </Box>
          </Paper>
        </Grid>

        {/* Logout Section */}
        <Grid item xs={12}>
          <Paper elevation={3} className="dashboard-section">
            <Box display="flex" flexDirection="column" alignItems="center" p={3}>
              <ExitToApp fontSize="large" className="icon" />
              <Typography variant="h6" component="h2">
                Logout
              </Typography>
              <Button 
                variant="contained" 
                color="secondary" 
                onClick={handleLogout} 
                className="dashboard-button"
              >
                Logout
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default UserDashboard;
