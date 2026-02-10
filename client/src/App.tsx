import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAppSelector } from './store/hooks';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import MultistepPrescription from './components/prescription/MultistepPrescription';
import PrescriptionList from './components/prescription/PrescriptionList';
import EmailVerification from './components/EmailVerification';
import PatientManagement from './components/PatientManagement';
import './App.css';
import AppointmentManagement from './components/Appointments';
import PrescriptionDetails from './components/prescription/PrescriptionDetails';
import Header from './components/Header';

function App() {
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  return (
    <Router>
      <div>
        <Header />
        <Routes>
          <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />} />
          <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/dashboard" />} />
          <Route path="/verify-email" element={<EmailVerification />} />
          <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
          <Route path="/create-prescription" element={isAuthenticated ? <MultistepPrescription /> : <Navigate to="/login" />} />
          <Route path="/prescriptions" element={isAuthenticated ? <PrescriptionList /> : <Navigate to="/login" />} />
          <Route
            path="/prescriptions/:id"
            element={isAuthenticated ? <PrescriptionDetails /> : <Navigate to="/login" />}
          />
          <Route path="/appointments" element={isAuthenticated ? <AppointmentManagement /> : <Navigate to="/login" />} />
          <Route path="/patients" element={isAuthenticated ? <PatientManagement /> : <Navigate to="/login" />} />
          <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
