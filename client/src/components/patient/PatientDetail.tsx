import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  fetchPatientById,
  fetchPatientPrescriptions,
  clearCurrentPatient,
} from '../../store/slices/patientSlice';

const PatientDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const {
    currentPatient,
    currentPatientPrescriptions,
    isLoading,
    error,
  } = useAppSelector((state) => state.patients);

  useEffect(() => {
    if (id) {
      dispatch(fetchPatientById(id));
      dispatch(fetchPatientPrescriptions(id));
    }

    return () => {
      dispatch(clearCurrentPatient());
    };
  }, [dispatch, id]);

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

  if (isLoading && !currentPatient) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading patient details...</p>
        </div>
      </div>
    );
  }

  if (error && !currentPatient) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <p className="text-lg text-red-500 mb-4">{error}</p>
          <Link to="/patients" className="text-primary font-medium hover:underline">
            Back to Patients
          </Link>
        </div>
      </div>
    );
  }

  if (!currentPatient) return null;

  const latestPrescription = currentPatientPrescriptions[0];
  const latestVitals = latestPrescription?.vitals;
  const hasVitals = latestVitals && Object.values(latestVitals).some((v: any) => v && v !== '');
  const hasMedicalHistory = currentPatient.allergies || currentPatient.comorbidities || currentPatient.smokingHistory || currentPatient.occupationalExposure;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => navigate('/patients')}
              className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/>
              </svg>
              Back to Patients
            </button>
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white">Patient Details</h1>
            <div className="w-32"></div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">

          {/* Patient Info Card */}
          <section className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
              <div className="flex items-center gap-4">
                <div className={`h-16 w-16 rounded-full flex items-center justify-center text-white font-bold text-xl ${getAvatarColor(currentPatient.name)}`}>
                  {getInitials(currentPatient.name)}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {currentPatient.name}
                  </h2>
                  <p className="text-gray-500 dark:text-gray-400">
                    {currentPatient.age} years &bull; {currentPatient.gender.charAt(0).toUpperCase() + currentPatient.gender.slice(1)}
                  </p>
                </div>
              </div>
              <button
                onClick={() => navigate('/create-prescription')}
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm font-semibold"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/>
                </svg>
                New Prescription
              </button>
            </div>

            {/* Contact Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4">
              <div>
                <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Phone</h3>
                <p className="text-sm text-gray-900 dark:text-white">{currentPatient.phone}</p>
              </div>

              {currentPatient.email && (
                <div>
                  <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Email</h3>
                  <p className="text-sm text-gray-900 dark:text-white">{currentPatient.email}</p>
                </div>
              )}

              {currentPatient.emergencyContact && (
                <div>
                  <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Emergency Contact</h3>
                  <p className="text-sm text-gray-900 dark:text-white">{currentPatient.emergencyContact}</p>
                </div>
              )}

              {currentPatient.address && (
                <div className="lg:col-span-2">
                  <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Address</h3>
                  <p className="text-sm text-gray-900 dark:text-white">{currentPatient.address}</p>
                </div>
              )}

              {currentPatient.insuranceId && (
                <div>
                  <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Insurance ID</h3>
                  <p className="text-sm text-gray-900 dark:text-white">{currentPatient.insuranceId}</p>
                </div>
              )}
            </div>

            {/* Medical History */}
            {hasMedicalHistory && (
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Medical History</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                  {currentPatient.allergies && (
                    <div>
                      <h4 className="text-xs font-medium text-red-600 dark:text-red-400 uppercase tracking-wider mb-1">Allergies</h4>
                      <p className="text-sm text-gray-900 dark:text-white">{currentPatient.allergies}</p>
                    </div>
                  )}
                  {currentPatient.comorbidities && (
                    <div>
                      <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Comorbidities</h4>
                      <p className="text-sm text-gray-900 dark:text-white">{currentPatient.comorbidities}</p>
                    </div>
                  )}
                  {currentPatient.smokingHistory && (
                    <div>
                      <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Smoking History</h4>
                      <p className="text-sm text-gray-900 dark:text-white">{currentPatient.smokingHistory}</p>
                    </div>
                  )}
                  {currentPatient.occupationalExposure && (
                    <div>
                      <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Occupational Exposure</h4>
                      <p className="text-sm text-gray-900 dark:text-white">{currentPatient.occupationalExposure}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </section>

          {/* Latest Vitals */}
          {hasVitals && (
            <section className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Latest Vitals</h3>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {new Date(latestPrescription.dateIssued).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {[
                  { label: 'Blood Pressure', value: latestVitals.bloodPressure, unit: 'mmHg' },
                  { label: 'Heart Rate', value: latestVitals.heartRate, unit: 'bpm' },
                  { label: 'Temperature', value: latestVitals.temperature, unit: '°C' },
                  { label: 'SpO2', value: latestVitals.oxygenSaturation, unit: '%' },
                  { label: 'Respiratory Rate', value: latestVitals.respiratoryRate, unit: '/min' },
                  { label: 'Weight', value: latestVitals.weight, unit: 'kg' },
                  { label: 'Height', value: latestVitals.height, unit: 'cm' },
                  { label: 'BMI', value: latestVitals.bmi, unit: 'kg/m²' },
                ].filter(v => v.value && v.value !== '').map((vital) => (
                  <div key={vital.label} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{vital.label}</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      {vital.value}
                      <span className="text-xs font-normal text-gray-400 ml-1">{vital.unit}</span>
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Prescription / Visit History */}
          <section className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Visit History
              {currentPatientPrescriptions.length > 0 && (
                <span className="ml-2 text-sm font-normal text-gray-500 dark:text-gray-400">
                  ({currentPatientPrescriptions.length} visit{currentPatientPrescriptions.length !== 1 ? 's' : ''})
                </span>
              )}
            </h3>

            {currentPatientPrescriptions.length === 0 ? (
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
                <h4 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No prescriptions yet</h4>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Create a prescription to start tracking this patient's visits.
                </p>
                <div className="mt-6">
                  <button
                    onClick={() => navigate('/create-prescription')}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm font-semibold"
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/>
                    </svg>
                    Create First Prescription
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {currentPatientPrescriptions.map((prescription: any) => (
                  <div
                    key={prescription.id}
                    onClick={() => navigate(`/prescriptions/${prescription.id}`)}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:border-primary/50 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-all"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                            {prescription.prescriptionNumber}
                          </span>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {new Date(prescription.dateIssued).toLocaleDateString('en-US', {
                              year: 'numeric', month: 'long', day: 'numeric'
                            })}
                          </span>
                        </div>

                        {/* Diagnosis */}
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {Array.isArray(prescription.diagnosis) && prescription.diagnosis.length > 0
                            ? prescription.diagnosis.map((d: any) => d.primaryDiagnosis).join(', ')
                            : 'No diagnosis recorded'}
                        </p>

                        {/* Medications summary */}
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          {prescription.medications?.length || 0} medication{prescription.medications?.length !== 1 ? 's' : ''} prescribed
                          {prescription.medications?.length > 0 && (
                            <span className="ml-1 text-gray-400">
                              — {prescription.medications.slice(0, 3).map((m: any) => m.name).join(', ')}
                              {prescription.medications.length > 3 && ` +${prescription.medications.length - 3} more`}
                            </span>
                          )}
                        </p>

                        {/* Vitals quick summary */}
                        {prescription.vitals && (
                          <div className="flex flex-wrap gap-3 mt-2">
                            {prescription.vitals.bloodPressure && (
                              <span className="text-xs text-gray-400 dark:text-gray-500">BP: {prescription.vitals.bloodPressure}</span>
                            )}
                            {prescription.vitals.heartRate && (
                              <span className="text-xs text-gray-400 dark:text-gray-500">HR: {prescription.vitals.heartRate}</span>
                            )}
                            {prescription.vitals.temperature && (
                              <span className="text-xs text-gray-400 dark:text-gray-500">Temp: {prescription.vitals.temperature}</span>
                            )}
                            {prescription.vitals.oxygenSaturation && (
                              <span className="text-xs text-gray-400 dark:text-gray-500">SpO2: {prescription.vitals.oxygenSaturation}</span>
                            )}
                          </div>
                        )}
                      </div>

                      <svg className="h-5 w-5 text-gray-400 flex-shrink-0 ml-4 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
                      </svg>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

        </div>
      </main>
    </div>
  );
};

export default PatientDetail;
