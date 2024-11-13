import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AdminDashboard.css'; // Ensure this CSS file is properly linked
import { FaUsers, FaSignOutAlt, FaTasks, FaUser } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdminDashboard = () => {
  const [adminData, setAdminData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [logs, setLogs] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [view, setView] = useState('default');
  const navigate = useNavigate();

  // Fetch admin, users, and logs data
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      try {
        const adminResponse = await axios.get('http://localhost:5050/api/admin-dashboard', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const usersResponse = await axios.get('http://localhost:5050/api/users', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const logsResponse = await axios.get('http://localhost:5050/api/logs', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (adminResponse.data.success && usersResponse.data.success) {
          setAdminData(adminResponse.data.admin);
          setUsers(usersResponse.data.users);
          setLogs(logsResponse.data.logs || []);
        } else {
          setError('Failed to fetch data.');
          handleLogout();
        }
      } catch (err) {
        setError('Error fetching data.');
        handleLogout();
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  // Delete user click handler
  const handleDeleteClick = (user) => {
    if (user.email === 'isindu980@gmail.com') {
      toast.error('Admin user cannot be deleted!');
      return;
    }
    setUserToDelete(user);
    setShowConfirm(true);
  };

  // Confirm delete handler
  const confirmDeleteUser = async () => {
    const token = localStorage.getItem('token');

    if (!token || !userToDelete) {
      console.error('No authorization token or user selected');
      return;
    }

    try {
      await axios.delete(`http://localhost:5050/api/users/${userToDelete._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Show success toast message
      toast.success(`User ${userToDelete.email} deleted successfully!`);

      // Remove deleted user from the list
      setUsers(users.filter((user) => user._id !== userToDelete._id));
      setShowConfirm(false);
      setUserToDelete(null);
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Failed to delete user. Please try again.');
      setShowConfirm(false);
      setUserToDelete(null);
    }
  };

  // Cancel delete handler
  const cancelDeleteUser = () => {
    setShowConfirm(false);
    setUserToDelete(null);
  };

  // Confirmation modal component
  const ConfirmModal = () => (
    <div className="confirm-modal">
      <div className="confirm-dialog">
        <h4>Confirm Delete</h4>
        <p>Are you sure you want to delete the user {userToDelete?.email}?</p>
        <button className="confirm-button" onClick={confirmDeleteUser}>Yes, Delete</button>
        <button className="cancel-button" onClick={cancelDeleteUser}>Cancel</button>
      </div>
    </div>
  );

  return (
    <div className="dashboard-container">
      <ToastContainer /> {/* Add ToastContainer to show notifications */}

      <div className="sidebar">
        <h2>Admin Panel</h2>
        <ul>
          <li onClick={() => setView('users')}><FaUsers /> View Users</li>
          <li onClick={() => setView('logs')}><FaTasks /> View Logs</li>
          <li onClick={handleLogout}><FaSignOutAlt /> Logout</li>
        </ul>
      </div>

      <div className="main-content">
        <div className="top-bar">
          <h2 className="typing-text">Welcome, {adminData?.username}</h2>
          {adminData && <p>{adminData.email}</p>}
        </div>

        <div className="content-section">
          {error && <p className="error-message">{error}</p>}

          {loading ? (
            <p>Loading data...</p>
          ) : (
            <>
              {view === 'default' && (
                <div>
                  <h3>Welcome admin!</h3>
                  <p>Your email is: {adminData?.email}</p>
                </div>
              )}

              {view === 'users' && (
                <div className="user-management">
                  <h3><FaUsers /> All Users</h3>
                  <ul className="user-list">
                    {users.map((user) => (
                      <li key={user._id}>
                        <FaUser /> {user.username} ({user.email})
                        <button onClick={() => handleDeleteClick(user)} className="action-button">
                          Delete
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {view === 'logs' && (
                <div className="logs">
                  <h3><FaTasks /> Log Activity</h3>
                  {logs.length === 0 ? (
                    <p>No logs available</p>
                  ) : (
                    <table className="logs-table">
                      <thead>
                        <tr>
                          <th>User ID</th>
                          <th>Username</th>
                          <th>Timestamp</th>
                          <th>Activity</th>
                        </tr>
                      </thead>
                      <tbody>
                        {logs.map((log) => (
                          <tr key={log.userId}>
                            <td>{log.userId}</td>
                            <td>{log.username}</td>
                            <td>{log.timestamp}</td>
                            <td>{log.activityType}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {showConfirm && <ConfirmModal />}
      </div>
    </div>
  );
};

export default AdminDashboard;