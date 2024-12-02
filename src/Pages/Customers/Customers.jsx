
import React, { useState, useEffect } from 'react';
import {
  Container, Table, TableHead, TableBody, TableCell, TableRow,
  Button, Typography, IconButton, Modal, Box, TextField
} from '@mui/material';
import { Edit, Delete, Add } from '@mui/icons-material';
import axios from 'axios';
import './Customers.css';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [formMode, setFormMode] = useState(''); // 'edit' or 'add'

  // Fetch customers from the database on component
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/customers', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`, // Use token for auth
          },
        });
        setCustomers(response.data);
      } catch (error) {
        console.error('Error fetching customers:', error);
      }
    };
    fetchCustomers();
  }, []);

  // Handle open/close modal
  const handleOpenModal = (mode, customer = null) => {
    setFormMode(mode);
    setSelectedCustomer(customer);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedCustomer(null);
  };

  // Handle add/edit customer
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (formMode === 'add') {
      try {
        const response = await axios.post('http://localhost:5000/api/customers', selectedCustomer, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`, // Use token for auth
          },
        });
        setCustomers([...customers, { ...selectedCustomer, id: response.data.customerId }]);
      } catch (error) {
        console.error('Error adding customer:', error);
      }
    } else if (formMode === 'edit') {
      try {
        await axios.put(`http://localhost:5000/api/customers/${selectedCustomer.id}`, selectedCustomer, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`, // Use token for auth
          },
        });
        setCustomers(customers.map(c => (c.id === selectedCustomer.id ? selectedCustomer : c)));
      } catch (error) {
        console.error('Error updating customer:', error);
      }
    }
    handleCloseModal();
  };

  const handleDeleteCustomer = async (customerId) => {
    try {
      await axios.delete(`http://localhost:5000/api/customers/${customerId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`, // Use token for auth
        },
      });
      setCustomers(customers.filter(customer => customer.id !== customerId));
    } catch (error) {
      console.error('Error deleting customer:', error);
    }
  };

  return (
    <Container>
      <Typography variant="h4">Customers</Typography>
      <Button variant="contained" color="primary" startIcon={<Add />} onClick={() => handleOpenModal('add')}>
        Add Customer
      </Button>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {customers.map((customer) => (
            <TableRow key={customer.id}>
              <TableCell>{customer.name}</TableCell>
              <TableCell>{customer.email}</TableCell>
              <TableCell>
                <IconButton onClick={() => handleOpenModal('edit', customer)}>
                  <Edit />
                </IconButton>
                <IconButton onClick={() => handleDeleteCustomer(customer.id)}>
                  <Delete />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Modal open={modalOpen} onClose={handleCloseModal}>
        <Box className="modal-box">
          <form onSubmit={handleFormSubmit}>
            <TextField
              label="Name"
              value={selectedCustomer?.name || ''}
              onChange={(e) => setSelectedCustomer({ ...selectedCustomer, name: e.target.value })}
              required
            />
            <TextField
              label="Email"
              type="email"
              value={selectedCustomer?.email || ''}
              onChange={(e) => setSelectedCustomer({ ...selectedCustomer, email: e.target.value })}
              required
            />
            <Button type="submit">{formMode === 'add' ? 'Add' : 'Update'} Customer</Button>
          </form>
        </Box>
      </Modal>
    </Container>
  );
};

export default Customers;
