import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchPatients, createPatient, updatePatient, deletePatient, clearError, setSearchQuery } from '../store/slices/patientSlice';
import { Patient } from '../store/slices/patientSlice';

const PatientManagement: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { patients, isLoading, error, searchQuery } = useAppSelector(state => state.patients);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);

  // Filter state
  const [openFilter, setOpenFilter] = useState<string | null>(null);
  const [genderFilter, setGenderFilter] = useState<string | null>(null);
  const [ageGroupFilter, setAgeGroupFilter] = useState<string | null>(null);
  const [lastVisitFilter, setLastVisitFilter] = useState<string | null>(null);
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

  // Close filter dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('[data-filter-dropdown]')) {
        setOpenFilter(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

  // Apply client-side filters
  const filteredPatients = patients.filter((patient) => {
    if (genderFilter && patient.gender !== genderFilter) return false;

    if (ageGroupFilter) {
      const age = patient.age;
      if (ageGroupFilter === '0-18' && (age < 0 || age > 18)) return false;
      if (ageGroupFilter === '19-35' && (age < 19 || age > 35)) return false;
      if (ageGroupFilter === '36-55' && (age < 36 || age > 55)) return false;
      if (ageGroupFilter === '56+' && age < 56) return false;
    }

    if (lastVisitFilter) {
      const visitDate = new Date(patient.updatedAt);
      const now = new Date();
      const diffDays = Math.floor((now.getTime() - visitDate.getTime()) / (1000 * 60 * 60 * 24));
      if (lastVisitFilter === '7days' && diffDays > 7) return false;
      if (lastVisitFilter === '30days' && diffDays > 30) return false;
      if (lastVisitFilter === '90days' && diffDays > 90) return false;
    }

    return true;
  });

  const hasActiveFilters = genderFilter || ageGroupFilter || lastVisitFilter;

  // Helper to generate initials color from name
  const getAvatarColor = (name: string) => {
    const colors = [
      'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-pink-500',
      'bg-indigo-500', 'bg-teal-500', 'bg-orange-500', 'bg-cyan-500',
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  // Patient list view
  return (
    <div className="flex min-h-screen flex-col bg-gray-50 dark:bg-gray-900">
      <main className="flex-grow">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Title + Search Row */}
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Patients</h2>
            <div className="relative w-full max-w-md">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => dispatch(setSearchQuery(e.target.value))}
                placeholder="Search by name, phone, or ID"
                className="block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white pl-10 focus:border-primary focus:ring-primary sm:text-sm py-2"
              />
            </div>
          </div>

          {/* Filter Buttons */}
          <div className="mb-6 flex flex-wrap items-center gap-4">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filter by:</span>
            <div className="flex flex-wrap gap-2">
              {/* Gender Filter */}
              <div className="relative" data-filter-dropdown>
                <button
                  type="button"
                  onClick={() => setOpenFilter(openFilter === 'gender' ? null : 'gender')}
                  className={`inline-flex items-center gap-x-1.5 rounded-md px-3 py-1.5 text-sm font-semibold shadow-sm ring-1 ring-inset hover:bg-gray-50 dark:hover:bg-gray-700 ${
                    genderFilter
                      ? 'bg-primary/10 text-primary ring-primary/30 dark:bg-primary/20'
                      : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 ring-gray-300 dark:ring-gray-600'
                  }`}
                >
                  {genderFilter ? `Gender: ${genderFilter.charAt(0).toUpperCase() + genderFilter.slice(1)}` : 'Gender'}
                  <svg className={`h-4 w-4 text-gray-400 transition-transform ${openFilter === 'gender' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/>
                  </svg>
                </button>
                {openFilter === 'gender' && (
                  <div className="absolute left-0 z-20 mt-1 w-40 rounded-md bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black/5 dark:ring-gray-700">
                    <div className="py-1">
                      <button
                        onClick={() => { setGenderFilter(null); setOpenFilter(null); }}
                        className={`block w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 ${!genderFilter ? 'font-semibold text-primary' : 'text-gray-700 dark:text-gray-300'}`}
                      >
                        All
                      </button>
                      {['male', 'female', 'other'].map((g) => (
                        <button
                          key={g}
                          onClick={() => { setGenderFilter(g); setOpenFilter(null); }}
                          className={`block w-full px-4 py-2 text-left text-sm capitalize hover:bg-gray-100 dark:hover:bg-gray-700 ${genderFilter === g ? 'font-semibold text-primary' : 'text-gray-700 dark:text-gray-300'}`}
                        >
                          {g}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Age Group Filter */}
              <div className="relative" data-filter-dropdown>
                <button
                  type="button"
                  onClick={() => setOpenFilter(openFilter === 'age' ? null : 'age')}
                  className={`inline-flex items-center gap-x-1.5 rounded-md px-3 py-1.5 text-sm font-semibold shadow-sm ring-1 ring-inset hover:bg-gray-50 dark:hover:bg-gray-700 ${
                    ageGroupFilter
                      ? 'bg-primary/10 text-primary ring-primary/30 dark:bg-primary/20'
                      : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 ring-gray-300 dark:ring-gray-600'
                  }`}
                >
                  {ageGroupFilter ? `Age: ${ageGroupFilter}` : 'Age Group'}
                  <svg className={`h-4 w-4 text-gray-400 transition-transform ${openFilter === 'age' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/>
                  </svg>
                </button>
                {openFilter === 'age' && (
                  <div className="absolute left-0 z-20 mt-1 w-40 rounded-md bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black/5 dark:ring-gray-700">
                    <div className="py-1">
                      <button
                        onClick={() => { setAgeGroupFilter(null); setOpenFilter(null); }}
                        className={`block w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 ${!ageGroupFilter ? 'font-semibold text-primary' : 'text-gray-700 dark:text-gray-300'}`}
                      >
                        All
                      </button>
                      {[
                        { value: '0-18', label: '0 - 18 years' },
                        { value: '19-35', label: '19 - 35 years' },
                        { value: '36-55', label: '36 - 55 years' },
                        { value: '56+', label: '56+ years' },
                      ].map((ag) => (
                        <button
                          key={ag.value}
                          onClick={() => { setAgeGroupFilter(ag.value); setOpenFilter(null); }}
                          className={`block w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 ${ageGroupFilter === ag.value ? 'font-semibold text-primary' : 'text-gray-700 dark:text-gray-300'}`}
                        >
                          {ag.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Last Visit Filter */}
              <div className="relative" data-filter-dropdown>
                <button
                  type="button"
                  onClick={() => setOpenFilter(openFilter === 'visit' ? null : 'visit')}
                  className={`inline-flex items-center gap-x-1.5 rounded-md px-3 py-1.5 text-sm font-semibold shadow-sm ring-1 ring-inset hover:bg-gray-50 dark:hover:bg-gray-700 ${
                    lastVisitFilter
                      ? 'bg-primary/10 text-primary ring-primary/30 dark:bg-primary/20'
                      : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 ring-gray-300 dark:ring-gray-600'
                  }`}
                >
                  {lastVisitFilter
                    ? `Visit: Last ${lastVisitFilter === '7days' ? '7 days' : lastVisitFilter === '30days' ? '30 days' : '90 days'}`
                    : 'Last Visit'}
                  <svg className={`h-4 w-4 text-gray-400 transition-transform ${openFilter === 'visit' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/>
                  </svg>
                </button>
                {openFilter === 'visit' && (
                  <div className="absolute left-0 z-20 mt-1 w-44 rounded-md bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black/5 dark:ring-gray-700">
                    <div className="py-1">
                      <button
                        onClick={() => { setLastVisitFilter(null); setOpenFilter(null); }}
                        className={`block w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 ${!lastVisitFilter ? 'font-semibold text-primary' : 'text-gray-700 dark:text-gray-300'}`}
                      >
                        All
                      </button>
                      {[
                        { value: '7days', label: 'Last 7 days' },
                        { value: '30days', label: 'Last 30 days' },
                        { value: '90days', label: 'Last 90 days' },
                      ].map((v) => (
                        <button
                          key={v.value}
                          onClick={() => { setLastVisitFilter(v.value); setOpenFilter(null); }}
                          className={`block w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 ${lastVisitFilter === v.value ? 'font-semibold text-primary' : 'text-gray-700 dark:text-gray-300'}`}
                        >
                          {v.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Clear Filters */}
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={() => { setGenderFilter(null); setAgeGroupFilter(null); setLastVisitFilter(null); }}
                  className="inline-flex items-center gap-x-1 rounded-md px-3 py-1.5 text-sm font-medium text-red-600 hover:text-red-500"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                  Clear filters
                </button>
              )}
            </div>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Patients Table */}
          <div className="overflow-hidden bg-white dark:bg-gray-800 shadow sm:rounded-md">
            {isLoading ? (
              <div className="p-8 text-center text-gray-500 dark:text-gray-400">Loading patients...</div>
            ) : filteredPatients.length === 0 ? (
              <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                {searchQuery || hasActiveFilters ? 'No patients found matching your criteria' : 'No patients found. Add your first patient to get started.'}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-900">
                    <tr>
                      <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-200 sm:pl-6">
                        Name
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-200">
                        Age
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-200">
                        Gender
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-200">
                        Phone
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-200">
                        Last Visit
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900 dark:text-gray-200 pr-6">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">
                    {filteredPatients.map((patient) => (
                      <tr key={patient.id} onClick={() => navigate(`/patients/${patient.id}`)} className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors">
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0">
                              <div className={`h-10 w-10 rounded-full flex items-center justify-center text-white font-semibold text-sm ${getAvatarColor(patient.name)}`}>
                                {getInitials(patient.name)}
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="font-medium text-gray-900 dark:text-white">{patient.name}</div>
                            </div>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                          {patient.age}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400 capitalize">
                          {patient.gender}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                          {patient.phone}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                          {new Date(patient.updatedAt).toISOString().split('T')[0]}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-right text-sm font-medium pr-6">
                          <button
                            onClick={(e) => { e.stopPropagation(); handleEditPatient(patient); }}
                            className="text-primary hover:text-primary/80 mr-3"
                          >
                            Edit
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); handleDeletePatient(patient.id); }}
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
      </main>

      {/* Floating Add New Patient Button */}
      <button
        onClick={handleAddPatient}
        type="button"
        className="fixed bottom-8 right-8 inline-flex items-center gap-x-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-lg hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-colors"
      >
        <svg className="h-5 w-5 -ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/>
        </svg>
        Add New Patient
      </button>
    </div>
  );
};

export default PatientManagement;
