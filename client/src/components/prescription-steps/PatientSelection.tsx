import React, { useState, useEffect } from 'react';

interface Patient {
  id?: string;
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  phone: string;
  email?: string;
  address?: string;
  emergencyContact?: string;
}

interface PatientSelectionProps {
  data: Patient;
  onUpdate: (data: Patient) => void;
  onNext: () => void;
}

const PatientSelection: React.FC<PatientSelectionProps> = ({ data, onUpdate, onNext }) => {
  const [existingPatients, setExistingPatients] = useState<Patient[]>([]);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchExistingPatients();
  }, []);

  const fetchExistingPatients = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8000/api/patients', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const patients = await response.json();
        setExistingPatients(patients);
      } else {
        // If patients endpoint doesn't exist, use empty array
        setExistingPatients([]);
      }
    } catch (err) {
      console.log('No existing patients endpoint - will use empty array');
      setExistingPatients([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredPatients = existingPatients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.phone.includes(searchTerm)
  );

  const handleSelectExistingPatient = (patient: Patient) => {
    setSelectedPatientId(patient.id || '');
    onUpdate(patient);
    setIsAddingNew(false);
  };

  const handleInputChange = (field: keyof Patient, value: string | number) => {
    onUpdate({
      ...data,
      [field]: value
    });
  };

  const handleNext = () => {
    if (!isAddingNew && !selectedPatientId) {
      setError('Please select a patient or add a new one');
      return;
    }
    
    if (isAddingNew) {
      if (!data.name.trim() || !data.phone.trim() || !data.age) {
        setError('Please fill in all required fields (Name, Age, Phone)');
        return;
      }
    }
    
    setError('');
    onNext();
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Patient Selection
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Select an existing patient or add a new patient to create prescription for
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {/* Toggle Buttons */}
      <div className="mb-6 flex gap-4">
        <button
          type="button"
          onClick={() => setIsAddingNew(false)}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            !isAddingNew
              ? 'bg-primary text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          Select Existing Patient
        </button>
        <button
          type="button"
          onClick={() => setIsAddingNew(true)}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            isAddingNew
              ? 'bg-primary text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          Add New Patient
        </button>
      </div>

      {!isAddingNew ? (
        /* Existing Patient Selection */
        <div className="space-y-4">
          {/* Search Bar */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Search Patients
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name or phone number..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          {/* Patient List */}
          <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-lg dark:border-gray-600">
            {loading ? (
              <div className="p-4 text-center text-gray-500">Loading patients...</div>
            ) : filteredPatients.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                {searchTerm ? 'No patients found matching your search' : 'No patients found. Add a new patient to get started.'}
              </div>
            ) : (
              filteredPatients.map((patient) => (
                <div
                  key={patient.id}
                  onClick={() => handleSelectExistingPatient(patient)}
                  className={`p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700 transition-colors ${
                    selectedPatientId === patient.id ? 'bg-primary/10 border-primary' : ''
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">{patient.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {patient.age} years • {patient.gender} • {patient.phone}
                      </p>
                      {patient.email && (
                        <p className="text-sm text-gray-500 dark:text-gray-400">{patient.email}</p>
                      )}
                    </div>
                    {selectedPatientId === patient.id && (
                      <div className="text-primary">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      ) : (
        /* Add New Patient Form */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Full Name *
            </label>
            <input
              type="text"
              value={data.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Enter patient's full name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Age *
            </label>
            <input
              type="number"
              value={data.age || ''}
              onChange={(e) => handleInputChange('age', parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Enter age"
              min="0"
              max="150"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Gender
            </label>
            <select
              value={data.gender}
              onChange={(e) => handleInputChange('gender', e.target.value as 'male' | 'female' | 'other')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Phone Number *
            </label>
            <input
              type="tel"
              value={data.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Enter phone number"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={data.email || ''}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Enter email address"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Emergency Contact
            </label>
            <input
              type="tel"
              value={data.emergencyContact || ''}
              onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Emergency contact number"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Address
            </label>
            <textarea
              value={data.address || ''}
              onChange={(e) => handleInputChange('address', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Enter full address"
            />
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-end mt-8 pt-6 border-t border-gray-200 dark:border-gray-600">
        <button
          onClick={handleNext}
          className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium"
        >
          Next: Diagnosis
        </button>
      </div>
    </div>
  );
};

export default PatientSelection;