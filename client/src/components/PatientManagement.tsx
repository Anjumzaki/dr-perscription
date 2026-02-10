import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchPatients, createPatient, updatePatient, deletePatient, clearError, setSearchQuery } from '../store/slices/patientSlice';
import { Patient } from '../store/slices/patientSlice';

const PatientManagement: React.FC = () => {
  const dispatch = useAppDispatch();
  const { patients, isLoading, error, searchQuery, total } = useAppSelector(state => state.patients);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    age: 0,
    gender: 'male' as 'male' | 'female' | 'other',
    phone: '',
    email: '',
    address: '',
    emergencyContact: '',
    allergies: '',
    comorbidities: '',
    smokingHistory: '',
    occupationalExposure: '',
    insuranceId: '',
  });

  useEffect(() => {
    dispatch(fetchPatients({}));
  }, [dispatch]);

  useEffect(() => {
    if (searchQuery) {
      const timeoutId = setTimeout(() => {
        dispatch(fetchPatients({ search: searchQuery }));
      }, 500);
      return () => clearTimeout(timeoutId);
    } else {
      dispatch(fetchPatients({}));
    }
  }, [searchQuery, dispatch]);

  const resetForm = () => {
    setFormData({
      name: '',
      age: 0,
      gender: 'male',
      phone: '',
      email: '',
      address: '',
      emergencyContact: '',
      allergies: '',
      comorbidities: '',
      smokingHistory: '',
      occupationalExposure: '',
      insuranceId: '',
    });
  };

  const handleAddPatient = () => {
    resetForm();
    setEditingPatient(null);
    setIsAddModalOpen(true);
    dispatch(clearError());
  };

  const handleEditPatient = (patient: Patient) => {
    setFormData({
      name: patient.name,
      age: patient.age,
      gender: patient.gender,
      phone: patient.phone,
      email: patient.email || '',
      address: patient.address || '',
      emergencyContact: patient.emergencyContact || '',
      allergies: patient.allergies || '',
      comorbidities: patient.comorbidities || '',
      smokingHistory: patient.smokingHistory || '',
      occupationalExposure: patient.occupationalExposure || '',
      insuranceId: patient.insuranceId || '',
    });
    setEditingPatient(patient);
    setIsAddModalOpen(true);
    dispatch(clearError());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingPatient) {
        await dispatch(updatePatient({
          id: editingPatient.id,
          ...formData
        })).unwrap();
      } else {
        await dispatch(createPatient(formData)).unwrap();
      }

      setIsAddModalOpen(false);
      resetForm();
      setEditingPatient(null);
    } catch (error) {
      // Error handled by Redux state
    }
  };

  const handleDeletePatient = async (patientId: string) => {
    if (window.confirm('Are you sure you want to delete this patient?')) {
      try {
        await dispatch(deletePatient(patientId)).unwrap();
      } catch (error) {
        // Error handled by Redux state
      }
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Full-page Add/Edit Patient form
  if (isAddModalOpen) {
    return (
      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen font-sans">
        <header className="sticky top-0 z-10 bg-white dark:bg-gray-800 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => { setIsAddModalOpen(false); setEditingPatient(null); }}
                  className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/>
                  </svg>
                  Back to Patients
                </button>
              </div>
              <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
                {editingPatient ? 'Edit Patient' : 'Add New Patient'}
              </h1>
              <div className="w-32"></div>
            </div>
          </div>
        </header>

        <main className="flex-1 px-4 sm:px-6 lg:px-10 py-8">
          <div className="mx-auto max-w-4xl">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
              {editingPatient ? 'Edit Patient' : 'Add New Patient'}
            </h1>

            {error && (
              <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mt-8 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
                <div className="space-y-8 p-8">
                  {/* Personal Information */}
                  <div>
                    <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">Personal Information</h2>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Enter the patient's basic details.</p>
                    <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-2">
                      {/* Full Name */}
                      <div className="sm:col-span-2">
                        <label className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-200" htmlFor="full-name">
                          Full Name *
                        </label>
                        <div className="mt-2">
                          <input
                            id="full-name"
                            type="text"
                            value={formData.name}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                            required
                            placeholder="e.g., Amelia Harper"
                            className="block w-full rounded-md border-0 bg-gray-100 dark:bg-gray-700 py-2.5 text-gray-900 dark:text-white ring-1 ring-inset ring-gray-200 dark:ring-gray-600 placeholder:text-gray-400 focus:bg-white dark:focus:bg-gray-600 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 px-3"
                          />
                        </div>
                      </div>

                      {/* Gender */}
                      <div>
                        <label className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-200" htmlFor="gender">
                          Gender *
                        </label>
                        <div className="mt-2">
                          <select
                            id="gender"
                            value={formData.gender}
                            onChange={(e) => handleInputChange('gender', e.target.value)}
                            className="block w-full rounded-md border-0 bg-gray-100 dark:bg-gray-700 py-2.5 text-gray-900 dark:text-white ring-1 ring-inset ring-gray-200 dark:ring-gray-600 focus:bg-white dark:focus:bg-gray-600 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 px-3"
                          >
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                      </div>

                      {/* Age */}
                      <div>
                        <label className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-200" htmlFor="age">
                          Age / Date of Birth *
                        </label>
                        <div className="mt-2">
                          <input
                            id="age"
                            type="number"
                            value={formData.age || ''}
                            onChange={(e) => handleInputChange('age', parseInt(e.target.value) || 0)}
                            required
                            min="0"
                            max="150"
                            placeholder="e.g., 35"
                            className="block w-full rounded-md border-0 bg-gray-100 dark:bg-gray-700 py-2.5 text-gray-900 dark:text-white ring-1 ring-inset ring-gray-200 dark:ring-gray-600 placeholder:text-gray-400 focus:bg-white dark:focus:bg-gray-600 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 px-3"
                          />
                        </div>
                      </div>

                      {/* Phone */}
                      <div>
                        <label className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-200" htmlFor="phone">
                          Phone *
                        </label>
                        <div className="mt-2">
                          <input
                            id="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => handleInputChange('phone', e.target.value)}
                            required
                            placeholder="e.g., +92-300-1234567"
                            className="block w-full rounded-md border-0 bg-gray-100 dark:bg-gray-700 py-2.5 text-gray-900 dark:text-white ring-1 ring-inset ring-gray-200 dark:ring-gray-600 placeholder:text-gray-400 focus:bg-white dark:focus:bg-gray-600 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 px-3"
                          />
                        </div>
                      </div>

                      {/* Email */}
                      <div>
                        <label className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-200" htmlFor="email">
                          Email
                        </label>
                        <div className="mt-2">
                          <input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            placeholder="e.g., amelia.harper@email.com"
                            className="block w-full rounded-md border-0 bg-gray-100 dark:bg-gray-700 py-2.5 text-gray-900 dark:text-white ring-1 ring-inset ring-gray-200 dark:ring-gray-600 placeholder:text-gray-400 focus:bg-white dark:focus:bg-gray-600 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 px-3"
                          />
                        </div>
                      </div>

                      {/* Address */}
                      <div className="sm:col-span-2">
                        <label className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-200" htmlFor="address">
                          Address
                        </label>
                        <div className="mt-2">
                          <textarea
                            id="address"
                            value={formData.address}
                            onChange={(e) => handleInputChange('address', e.target.value)}
                            rows={3}
                            placeholder="e.g., 123 Elm Street, Anytown"
                            className="block w-full rounded-md border-0 bg-gray-100 dark:bg-gray-700 py-2.5 text-gray-900 dark:text-white ring-1 ring-inset ring-gray-200 dark:ring-gray-600 placeholder:text-gray-400 focus:bg-white dark:focus:bg-gray-600 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 px-3"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Medical Information */}
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
                    <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">Medical Information</h2>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Record the patient's medical history.</p>
                    <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-2">
                      {/* Allergies */}
                      <div className="sm:col-span-2">
                        <label className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-200" htmlFor="allergies">
                          Allergies
                        </label>
                        <div className="mt-2">
                          <textarea
                            id="allergies"
                            value={formData.allergies}
                            onChange={(e) => handleInputChange('allergies', e.target.value)}
                            rows={3}
                            placeholder="e.g., Penicillin, Latex"
                            className="block w-full rounded-md border-0 bg-gray-100 dark:bg-gray-700 py-2.5 text-gray-900 dark:text-white ring-1 ring-inset ring-gray-200 dark:ring-gray-600 placeholder:text-gray-400 focus:bg-white dark:focus:bg-gray-600 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 px-3"
                          />
                        </div>
                      </div>

                      {/* Comorbidities */}
                      <div className="sm:col-span-2">
                        <label className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-200" htmlFor="comorbidities">
                          Comorbidities
                        </label>
                        <div className="mt-2">
                          <textarea
                            id="comorbidities"
                            value={formData.comorbidities}
                            onChange={(e) => handleInputChange('comorbidities', e.target.value)}
                            rows={3}
                            placeholder="e.g., Hypertension, Diabetes, Ischemic Heart Disease, GERD"
                            className="block w-full rounded-md border-0 bg-gray-100 dark:bg-gray-700 py-2.5 text-gray-900 dark:text-white ring-1 ring-inset ring-gray-200 dark:ring-gray-600 placeholder:text-gray-400 focus:bg-white dark:focus:bg-gray-600 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 px-3"
                          />
                        </div>
                      </div>

                      {/* Smoking History */}
                      <div>
                        <label className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-200" htmlFor="smoking-history">
                          Smoking History (Pack-Years)
                        </label>
                        <div className="mt-2">
                          <input
                            id="smoking-history"
                            type="text"
                            value={formData.smokingHistory}
                            onChange={(e) => handleInputChange('smokingHistory', e.target.value)}
                            placeholder="e.g., 10"
                            className="block w-full rounded-md border-0 bg-gray-100 dark:bg-gray-700 py-2.5 text-gray-900 dark:text-white ring-1 ring-inset ring-gray-200 dark:ring-gray-600 placeholder:text-gray-400 focus:bg-white dark:focus:bg-gray-600 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 px-3"
                          />
                        </div>
                      </div>

                      {/* Emergency Contact */}
                      <div>
                        <label className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-200" htmlFor="emergency-contact">
                          Emergency Contact
                        </label>
                        <div className="mt-2">
                          <input
                            id="emergency-contact"
                            type="tel"
                            value={formData.emergencyContact}
                            onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                            placeholder="e.g., +92-300-9876543"
                            className="block w-full rounded-md border-0 bg-gray-100 dark:bg-gray-700 py-2.5 text-gray-900 dark:text-white ring-1 ring-inset ring-gray-200 dark:ring-gray-600 placeholder:text-gray-400 focus:bg-white dark:focus:bg-gray-600 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 px-3"
                          />
                        </div>
                      </div>

                      {/* Occupational Exposure */}
                      <div className="sm:col-span-2">
                        <label className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-200" htmlFor="occupational-exposure">
                          Occupational Exposure
                        </label>
                        <div className="mt-2">
                          <textarea
                            id="occupational-exposure"
                            value={formData.occupationalExposure}
                            onChange={(e) => handleInputChange('occupationalExposure', e.target.value)}
                            rows={3}
                            placeholder="e.g., Asbestos, Silica"
                            className="block w-full rounded-md border-0 bg-gray-100 dark:bg-gray-700 py-2.5 text-gray-900 dark:text-white ring-1 ring-inset ring-gray-200 dark:ring-gray-600 placeholder:text-gray-400 focus:bg-white dark:focus:bg-gray-600 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 px-3"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Additional Information */}
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
                    <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">Additional Information</h2>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Optional details for insurance and identification.</p>
                    <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-2">
                      {/* Insurance ID */}
                      <div>
                        <label className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-200" htmlFor="insurance-id">
                          Insurance / ID Number (Optional)
                        </label>
                        <div className="mt-2">
                          <input
                            id="insurance-id"
                            type="text"
                            value={formData.insuranceId}
                            onChange={(e) => handleInputChange('insuranceId', e.target.value)}
                            placeholder="e.g., 123456789"
                            className="block w-full rounded-md border-0 bg-gray-100 dark:bg-gray-700 py-2.5 text-gray-900 dark:text-white ring-1 ring-inset ring-gray-200 dark:ring-gray-600 placeholder:text-gray-400 focus:bg-white dark:focus:bg-gray-600 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 px-3"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex items-center justify-end gap-x-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 px-8 py-4 rounded-b-md">
                  <button
                    type="button"
                    onClick={() => { setIsAddModalOpen(false); setEditingPatient(null); }}
                    className="text-sm font-semibold leading-6 text-gray-900 dark:text-gray-300 hover:text-gray-600 dark:hover:text-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? 'Saving...' : editingPatient ? 'Update Patient' : 'Save'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </main>
      </div>
    );
  }

  // Patient list view
  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen font-sans">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link
                to="/dashboard"
                className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/>
                </svg>
                Back to Dashboard
              </Link>
            </div>
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
              Patient Management
            </h1>
            <div className="w-32"></div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <div className="mb-4 sm:mb-0">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Patients</h2>
            <p className="text-gray-600 dark:text-gray-400">Total: {total} patients</p>
          </div>

          <button
            onClick={handleAddPatient}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
            </svg>
            Add New Patient
          </button>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => dispatch(setSearchQuery(e.target.value))}
              placeholder="Search patients by name, phone, or email..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            <svg className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {/* Patients List */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          {isLoading ? (
            <div className="p-8 text-center text-gray-500">Loading patients...</div>
          ) : patients.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              {searchQuery ? 'No patients found matching your search' : 'No patients found. Add your first patient to get started.'}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Patient</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Contact</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Medical</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Added</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {patients.map((patient) => (
                    <tr key={patient.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">{patient.name}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{patient.age} years | {patient.gender}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm text-gray-900 dark:text-white">{patient.phone}</div>
                          {patient.email && (
                            <div className="text-sm text-gray-500 dark:text-gray-400">{patient.email}</div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 dark:text-white max-w-xs">
                          {patient.allergies && (
                            <div className="text-xs text-red-600 dark:text-red-400 truncate">Allergies: {patient.allergies}</div>
                          )}
                          {patient.comorbidities && (
                            <div className="text-xs text-gray-500 dark:text-gray-400 truncate">Comorbidities: {patient.comorbidities}</div>
                          )}
                          {!patient.allergies && !patient.comorbidities && (
                            <span className="text-xs text-gray-400">—</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {new Date(patient.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleEditPatient(patient)}
                          className="text-primary hover:text-primary/80 mr-3"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeletePatient(patient.id)}
                          className="text-red-600 hover:text-red-500"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientManagement;
