import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
}

const CreatePrescription: React.FC = () => {
  const [patient, setPatient] = useState({
    name: '',
    age: '',
    gender: 'male',
    address: '',
    phone: '',
    email: ''
  });

  const [medications, setMedications] = useState<Medication[]>([
    { name: '', dosage: '', frequency: '', duration: '', instructions: '' }
  ]);

  const [diagnosis, setDiagnosis] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const addMedication = () => {
    setMedications([...medications, { name: '', dosage: '', frequency: '', duration: '', instructions: '' }]);
  };

  const removeMedication = (index: number) => {
    if (medications.length > 1) {
      setMedications(medications.filter((_, i) => i !== index));
    }
  };

  const updateMedication = (index: number, field: keyof Medication, value: string) => {
    const updated = medications.map((med, i) => 
      i === index ? { ...med, [field]: value } : med
    );
    setMedications(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:8000/api/prescriptions',
        {
          patient: { ...patient, age: parseInt(patient.age) },
          medications,
          diagnosis,
          notes
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      alert('Prescription created successfully!');
      navigate('/prescriptions');
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to create prescription');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '20px' }}>
        <Link to="/dashboard" style={{ color: '#007bff', textDecoration: 'none' }}>← Back to Dashboard</Link>
      </div>
      
      <h2>Create New Prescription</h2>
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '30px', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
          <h3>Patient Information</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div>
              <label>Patient Name:</label>
              <input
                type="text"
                value={patient.name}
                onChange={(e) => setPatient({...patient, name: e.target.value})}
                required
                style={{ width: '100%', padding: '8px', marginTop: '5px' }}
              />
            </div>
            <div>
              <label>Age:</label>
              <input
                type="number"
                value={patient.age}
                onChange={(e) => setPatient({...patient, age: e.target.value})}
                required
                min="0"
                max="150"
                style={{ width: '100%', padding: '8px', marginTop: '5px' }}
              />
            </div>
            <div>
              <label>Gender:</label>
              <select
                value={patient.gender}
                onChange={(e) => setPatient({...patient, gender: e.target.value})}
                style={{ width: '100%', padding: '8px', marginTop: '5px' }}
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label>Phone:</label>
              <input
                type="tel"
                value={patient.phone}
                onChange={(e) => setPatient({...patient, phone: e.target.value})}
                style={{ width: '100%', padding: '8px', marginTop: '5px' }}
              />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label>Address:</label>
              <input
                type="text"
                value={patient.address}
                onChange={(e) => setPatient({...patient, address: e.target.value})}
                style={{ width: '100%', padding: '8px', marginTop: '5px' }}
              />
            </div>
          </div>
        </div>

        <div style={{ marginBottom: '30px', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
          <h3>Medications</h3>
          {medications.map((med, index) => (
            <div key={index} style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <h4>Medication {index + 1}</h4>
                {medications.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeMedication(index)}
                    style={{ backgroundColor: '#dc3545', color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer' }}
                  >
                    Remove
                  </button>
                )}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label>Medicine Name:</label>
                  <input
                    type="text"
                    value={med.name}
                    onChange={(e) => updateMedication(index, 'name', e.target.value)}
                    required
                    style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                  />
                </div>
                <div>
                  <label>Dosage:</label>
                  <input
                    type="text"
                    value={med.dosage}
                    onChange={(e) => updateMedication(index, 'dosage', e.target.value)}
                    required
                    placeholder="e.g., 500mg"
                    style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                  />
                </div>
                <div>
                  <label>Frequency:</label>
                  <input
                    type="text"
                    value={med.frequency}
                    onChange={(e) => updateMedication(index, 'frequency', e.target.value)}
                    required
                    placeholder="e.g., Twice daily"
                    style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                  />
                </div>
                <div>
                  <label>Duration:</label>
                  <input
                    type="text"
                    value={med.duration}
                    onChange={(e) => updateMedication(index, 'duration', e.target.value)}
                    required
                    placeholder="e.g., 7 days"
                    style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                  />
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label>Instructions:</label>
                  <input
                    type="text"
                    value={med.instructions}
                    onChange={(e) => updateMedication(index, 'instructions', e.target.value)}
                    placeholder="e.g., Take after meals"
                    style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                  />
                </div>
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={addMedication}
            style={{ padding: '10px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', cursor: 'pointer' }}
          >
            Add Another Medication
          </button>
        </div>

        <div style={{ marginBottom: '30px', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
          <h3>Diagnosis & Notes</h3>
          <div style={{ marginBottom: '15px' }}>
            <label>Diagnosis:</label>
            <textarea
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
              required
              rows={3}
              style={{ width: '100%', padding: '8px', marginTop: '5px', resize: 'vertical' }}
            />
          </div>
          <div>
            <label>Additional Notes:</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              style={{ width: '100%', padding: '8px', marginTop: '5px', resize: 'vertical' }}
            />
          </div>
        </div>

        {error && <div style={{ color: 'red', marginBottom: '20px' }}>{error}</div>}
        
        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '15px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            fontSize: '16px',
            cursor: 'pointer'
          }}
        >
          {loading ? 'Creating Prescription...' : 'Create Prescription'}
        </button>
      </form>
    </div>
  );
};

export default CreatePrescription;