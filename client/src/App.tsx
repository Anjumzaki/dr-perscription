import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import CreatePrescription from './components/CreatePrescription';
import MultistepPrescription from './components/MultistepPrescription';
import PrescriptionList from './components/PrescriptionList';
import EmailVerification from './components/EmailVerification';
import './App.css';

function App() {
  const token = localStorage.getItem('token');

  return (
    <Router>
      <div>
        <Routes>
          <Route path="/login" element={!token ? <Login /> : <Navigate to="/dashboard" />} />
          <Route path="/register" element={!token ? <Register /> : <Navigate to="/dashboard" />} />
          <Route path="/verify-email" element={<EmailVerification />} />
          <Route path="/dashboard" element={token ? <Dashboard /> : <Navigate to="/login" />} />
          <Route path="/create-prescription" element={token ? <MultistepPrescription /> : <Navigate to="/login" />} />
          <Route path="/prescriptions" element={token ? <PrescriptionList /> : <Navigate to="/login" />} />
          <Route path="/" element={<Navigate to={token ? "/dashboard" : "/login"} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
