import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div style={{ padding: '20px' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1>Dr. Prescription Dashboard</h1>
        <button 
          onClick={handleLogout}
          style={{ padding: '8px 16px', backgroundColor: '#dc3545', color: 'white', border: 'none', cursor: 'pointer' }}
        >
          Logout
        </button>
      </header>

      <div style={{ marginBottom: '30px' }}>
        <h2>Welcome, Dr. {user.name}</h2>
        <p><strong>License Number:</strong> {user.licenseNumber}</p>
        <p><strong>Specialization:</strong> {user.specialization}</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
        <div style={{ 
          border: '1px solid #ddd', 
          padding: '20px', 
          borderRadius: '8px', 
          textAlign: 'center',
          backgroundColor: '#f8f9fa'
        }}>
          <h3>Create New Prescription</h3>
          <p>Write a new prescription for your patient</p>
          <Link 
            to="/create-prescription"
            style={{ 
              display: 'inline-block',
              padding: '10px 20px', 
              backgroundColor: '#007bff', 
              color: 'white', 
              textDecoration: 'none',
              borderRadius: '4px'
            }}
          >
            Create Prescription
          </Link>
        </div>

        <div style={{ 
          border: '1px solid #ddd', 
          padding: '20px', 
          borderRadius: '8px', 
          textAlign: 'center',
          backgroundColor: '#f8f9fa'
        }}>
          <h3>View Prescriptions</h3>
          <p>View and manage your existing prescriptions</p>
          <Link 
            to="/prescriptions"
            style={{ 
              display: 'inline-block',
              padding: '10px 20px', 
              backgroundColor: '#28a745', 
              color: 'white', 
              textDecoration: 'none',
              borderRadius: '4px'
            }}
          >
            View Prescriptions
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;