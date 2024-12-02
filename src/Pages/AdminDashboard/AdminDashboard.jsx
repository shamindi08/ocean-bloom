import React from 'react';
import './AdminDashboard.css';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear any store tokens and redirect to login
    localStorage.removeItem('token');
    navigate('/signin');
  };

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <h1>Admin Dashboard</h1>
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </header>
      <main className="admin-content">
        <section className="admin-section">
          <h2>Manage Users</h2>
          <p>View and manage registered users.</p>
          <button onClick={() => navigate('/admin/users')} className="admin-action-button">
            Go to User Management
          </button>
        </section>
        <section className="admin-section">
          <h2>Manage Products</h2>
          <p>View, add, or edit products available on the platform.</p>
          <button onClick={() => navigate('/admin/products')} className="admin-action-button">
            Go to Product Management
          </button>
        </section>
        <section className="admin-section">
          <h2>Reports</h2>
          <p>View detailed reports of user activities and sales.</p>
          <button onClick={() => navigate('/admin/reports')} className="admin-action-button">
            View Reports
          </button>
        </section>
      </main>
    </div>
  );
};

export default AdminDashboard;
