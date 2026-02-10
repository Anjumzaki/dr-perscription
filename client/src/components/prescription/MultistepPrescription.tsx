import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { createPrescription, clearError } from '../../store/slices/prescriptionSlice';

// Step components
import PatientSelection from './prescription-steps/PatientSelection';
import PatientDiagnosis from './prescription-steps/PatientDiagnosis';
import LifestyleAdvice from './prescription-steps/LifestyleAdvice';
import VitalsAndTests from './prescription-steps/VitalsAndTests';
import WritePrescription from './prescription-steps/WritePrescription';

interface PrescriptionData {
  // Patient Info
  patient: {
    id?: string;
    name: string;
    age: number;
    gender: 'male' | 'female' | 'other';
    phone: string;
    email?: string;
    address?: string;
    emergencyContact?: string;
    allergies?: string;
    comorbidities?: string;
    smokingHistory?: string;
    occupationalExposure?: string;
    insuranceId?: string;
  };

  // Diagnosis (array of multiple diagnoses)
  diagnosis: {
    primaryDiagnosis: string;
    secondaryDiagnosis?: string;
    symptoms: string[];
    duration: string;
    severity: 'mild' | 'moderate' | 'severe';
    notes?: string;
  }[];

  // Lifestyle Advice
  lifestyle: {
    dietaryAdvice: string[];
    exerciseRecommendations: string[];
    lifestyleModifications: string[];
    followUpInstructions: string;
  };

  // Vitals and Tests
  vitals: {
    bloodPressure?: string;
    temperature?: string;
    heartRate?: string;
    weight?: string;
    height?: string;
    bmi?: string;
    oxygenSaturation?: string;
    respiratoryRate?: string;
  };

  tests: {
    orderedTests: string[];
    labResults?: string[];
    imagingResults?: string[];
    testNotes?: string;
  };

  // Prescription
  medications: {
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
    instructions?: string;
  }[];
}

const MultistepPrescription: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isLoading, error: reduxError } = useAppSelector(state => state.prescriptions);

  const [currentStep, setCurrentStep] = useState(1);

  const [prescriptionData, setPrescriptionData] = useState<PrescriptionData>({
    patient: {
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
      insuranceId: ''
    },
    diagnosis: [],
    lifestyle: {
      dietaryAdvice: [],
      exerciseRecommendations: [],
      lifestyleModifications: [],
      followUpInstructions: ''
    },
    vitals: {
      bloodPressure: '',
      temperature: '',
      heartRate: '',
      weight: '',
      height: '',
      bmi: '',
      oxygenSaturation: '',
      respiratoryRate: ''
    },
    tests: {
      orderedTests: [],
      labResults: [],
      imagingResults: [],
      testNotes: ''
    },
    medications: []
  });

  const totalSteps = 5;

  const steps = [
    { id: 1, title: 'Patient Selection', description: 'Select or add patient details' },
    { id: 2, title: 'Diagnosis', description: 'Patient diagnosis and symptoms' },
    { id: 3, title: 'Lifestyle Advice', description: 'Recommendations and advice' },
    { id: 4, title: 'Vitals & Tests', description: 'Patient vitals and test results' },
    { id: 5, title: 'Prescription', description: 'Write prescription and medications' }
  ];

  const updatePrescriptionData = (section: keyof PrescriptionData, data: any) => {
    setPrescriptionData(prev => ({
      ...prev,
      [section]: (section === 'medications' || section === 'diagnosis') ? data : { ...prev[section], ...data }
    }));
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToStep = (step: number) => {
    if (step >= 1 && step <= totalSteps) {
      setCurrentStep(step);
    }
  };

  const handleSubmit = async () => {
    dispatch(clearError());

    try {
      // Prepare the data for the API call
      const prescriptionPayload = {
        patient: prescriptionData.patient,
        diagnosis: prescriptionData.diagnosis,
        lifestyle: prescriptionData.lifestyle,
        vitals: prescriptionData.vitals,
        tests: prescriptionData.tests,
        medications: prescriptionData.medications,
        notes: prescriptionData.lifestyle.followUpInstructions || ''
      };

      console.log('Submitting prescription with payload:', prescriptionPayload);

      await dispatch(createPrescription(prescriptionPayload)).unwrap();

      alert('Prescription created successfully!');
      navigate('/prescriptions');
    } catch (error) {
      console.error('Failed to create prescription:', error);
      // Error is handled by Redux state
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <PatientSelection
            data={prescriptionData.patient}
            onUpdate={(data) => updatePrescriptionData('patient', data)}
            onNext={nextStep}
          />
        );
      case 2:
        return (
          <PatientDiagnosis
            data={prescriptionData.diagnosis}
            onUpdate={(data) => updatePrescriptionData('diagnosis', data)}
            onNext={nextStep}
            onPrev={prevStep}
          />
        );
      case 3:
        return (
          <LifestyleAdvice
            data={prescriptionData.lifestyle}
            onUpdate={(data) => updatePrescriptionData('lifestyle', data)}
            onNext={nextStep}
            onPrev={prevStep}
          />
        );
      case 4:
        return (
          <VitalsAndTests
            vitalsData={prescriptionData.vitals}
            testsData={prescriptionData.tests}
            onUpdateVitals={(data) => updatePrescriptionData('vitals', data)}
            onUpdateTests={(data) => updatePrescriptionData('tests', data)}
            onNext={nextStep}
            onPrev={prevStep}
          />
        );
      case 5:
        return (
          <WritePrescription
            data={prescriptionData.medications}
            onUpdate={(data) => updatePrescriptionData('medications', data)}
            onSubmit={handleSubmit}
            onPrev={prevStep}
            loading={isLoading}
            error={reduxError || ''}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-background-light dark:bg-background-dark font-display min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm border-b border-primary/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link
                to="/dashboard"
                className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
                Back to Dashboard
              </Link>
            </div>
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
              New Prescription - Step {currentStep} of {totalSteps}
            </h1>
            <div className="w-32"> {/* Spacer for centering */}
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={`flex items-center cursor-pointer ${currentStep >= step.id ? 'text-primary' : 'text-gray-400'
                    }`}
                  onClick={() => goToStep(step.id)}
                >
                  <div className={`
                    flex items-center justify-center w-8 h-8 rounded-full border-2 text-sm font-medium
                    ${currentStep >= step.id
                      ? 'bg-primary border-primary text-white'
                      : 'border-gray-300 text-gray-400 bg-white dark:bg-gray-800'
                    }
                  `}>
                    {currentStep > step.id ? (
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      step.id
                    )}
                  </div>
                  <div className="ml-3 hidden sm:block">
                    <p className={`text-sm font-medium ${currentStep >= step.id ? 'text-gray-900 dark:text-white' : 'text-gray-400'
                      }`}>
                      {step.title}
                    </p>
                    <p className="text-xs text-gray-500">{step.description}</p>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 mx-4 h-0.5 ${currentStep > step.id ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-700'
                    }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          {renderStep()}
        </div>
      </div>
    </div>
  );
};

export default MultistepPrescription;