import React, { useEffect, useState } from 'react';
import { Container, Grid, Paper, Typography, Button,} from '@mui/material';
import { Box } from '@mui/system';
import { Person,  ExitToApp, History } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './UserDashboard.css';

const UserDashboard = () => {
  const [activityLogs, setActivityLogs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/signin');
        return;
      }

      try {
        const response = await axios.get('http://localhost:5050/api/user/verify-token', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.status !== 200) {
          localStorage.removeItem('token');
          navigate('/');
        }
      } catch (error) {
        console.error('Token verification failed:', error);
        localStorage.removeItem('token');
        navigate('/');
      }
    };

    verifyToken();

    // Fetch user activity logs
    const fetchActivityLogs = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get('http://localhost:5050/api/user/activity-logs', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setActivityLogs(response.data);
      } catch (error) {
        console.error('Error fetching activity logs:', error);
      }
    };

    fetchActivityLogs();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.get("http://localhost:5050/api/user/logout", {
        headers: { Authorization: `Bearer ${token}` },
      });
      localStorage.removeItem("token");
      navigate("/");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <Container maxWidth="lg" className="user-dashboard">
      <Typography variant="h4" component="h1" gutterBottom align="center">
        User Dashboard
      </Typography>
      <Grid container spacing={4}>
        {/* Existing Sections */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} className="dashboard-section">
            <Box display="flex" flexDirection="column" alignItems="center" p={3}>
              <Person fontSize="large" className="icon" />
              <Typography variant="h6">View Profile</Typography>
              <Link to="/profile">
                <Button variant="contained" color="primary">View Profile</Button>
              </Link>
            </Box>
          </Paper>
        </Grid>
        
        
        {/* Activity Log Section */}
        <Grid item xs={12} md={8}>
  <Paper elevation={3} className="dashboard-section">
    <Link to="/activity-logs" style={{ textDecoration: 'none', color: 'inherit' }}>
      <Box display="flex" flexDirection="column" alignItems="center" p={3}>
        <History fontSize="large" className="icon" />
        <Typography variant="h6">Activity Log</Typography>
        <Typography variant="body2" color="textSecondary" align="center">
          Click to view detailed activity logs
        </Typography>
      </Box>
    </Link>
  </Paper>
</Grid>

        {/* Logout Section */}
        <Grid item xs={12}>
          <Paper elevation={3} className="dashboard-section">
            <Box display="flex" flexDirection="column" alignItems="center" p={3}>
              <ExitToApp fontSize="large" className="icon" />
              <Typography variant="h6">Logout</Typography>
              <Button variant="contained" color="secondary" onClick={handleLogout}>
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
