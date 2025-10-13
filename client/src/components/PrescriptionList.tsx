import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

interface Prescription {
  _id: string;
  prescriptionNumber: string;
  patient: {
    name: string;
    age: number;
    gender: string;
  };
  medications: Array<{
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
  }>;
  diagnosis: string;
  dateIssued: string;
}

const PrescriptionList: React.FC = () => {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const fetchPrescriptions = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/prescriptions', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPrescriptions(response.data.prescriptions);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to fetch prescriptions');
    } finally {
      setLoading(false);
    }
  };

  const deletePrescription = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this prescription?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:5000/api/prescriptions/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setPrescriptions(prescriptions.filter(p => p._id !== id));
      } catch (error: any) {
        alert(error.response?.data?.message || 'Failed to delete prescription');
      }
    }
  };

  if (loading) return <div style={{ padding: '20px' }}>Loading...</div>;
  if (error) return <div style={{ padding: '20px', color: 'red' }}>Error: {error}</div>;

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to="/dashboard" style={{ color: '#007bff', textDecoration: 'none' }}>← Back to Dashboard</Link>
        <Link 
          to="/create-prescription" 
          style={{ 
            padding: '10px 20px', 
            backgroundColor: '#007bff', 
            color: 'white', 
            textDecoration: 'none',
            borderRadius: '4px'
          }}
        >
          Create New Prescription
        </Link>
      </div>

      <h2>My Prescriptions</h2>

      {prescriptions.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <p>No prescriptions found.</p>
          <Link 
            to="/create-prescription"
            style={{ 
              padding: '10px 20px', 
              backgroundColor: '#007bff', 
              color: 'white', 
              textDecoration: 'none',
              borderRadius: '4px'
            }}
          >
            Create Your First Prescription
          </Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '20px' }}>
          {prescriptions.map((prescription) => (
            <div 
              key={prescription._id} 
              style={{ 
                border: '1px solid #ddd', 
                padding: '20px', 
                borderRadius: '8px',
                backgroundColor: '#f8f9fa'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <h3 style={{ margin: 0, color: '#007bff' }}>
                  Prescription #{prescription.prescriptionNumber}
                </h3>
                <button
                  onClick={() => deletePrescription(prescription._id)}
                  style={{
                    padding: '5px 15px',
                    backgroundColor: '#dc3545',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Delete
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                  <h4>Patient Information</h4>
                  <p><strong>Name:</strong> {prescription.patient.name}</p>
                  <p><strong>Age:</strong> {prescription.patient.age}</p>
                  <p><strong>Gender:</strong> {prescription.patient.gender}</p>
                  <p><strong>Date Issued:</strong> {new Date(prescription.dateIssued).toLocaleDateString()}</p>
                </div>

                <div>
                  <h4>Diagnosis</h4>
                  <p>{prescription.diagnosis}</p>
                </div>
              </div>

              <div style={{ marginTop: '15px' }}>
                <h4>Medications</h4>
                <div style={{ display: 'grid', gap: '10px' }}>
                  {prescription.medications.map((med, index) => (
                    <div 
                      key={index} 
                      style={{ 
                        padding: '10px', 
                        backgroundColor: 'white', 
                        borderRadius: '4px',
                        border: '1px solid #eee'
                      }}
                    >
                      <strong>{med.name}</strong> - {med.dosage}
                      <br />
                      <small>{med.frequency} for {med.duration}</small>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PrescriptionList;