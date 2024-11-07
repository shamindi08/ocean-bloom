import React from 'react';
import { Container, Grid, Paper, Typography, Button } from '@mui/material';
import { Box } from '@mui/system';
import { People } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import './AdminDashboard.css';

const AdminDashboard = () => {
  return (
    <Container maxWidth="lg" className="admin-dashboard">
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Admin Dashboard
      </Typography>
      <Grid container spacing={4}>
        {/* Manage Customers Section */}
        <Grid item xs={12} md={3}>
          <Paper elevation={3} className="dashboard-section">
            <Box display="flex" flexDirection="column" alignItems="center" p={3}>
              <People fontSize="large" className="icon" />
              <Typography variant="h6" component="h2">
                Manage Customers
              </Typography>
              <Link to="/customers">
                <Button variant="contained" color="primary" className="dashboard-button">
                  View Customers
                </Button>
              </Link>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AdminDashboard;
