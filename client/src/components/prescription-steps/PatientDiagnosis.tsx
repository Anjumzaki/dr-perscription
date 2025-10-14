import React, { useState } from 'react';

interface Diagnosis {
  primaryDiagnosis: string;
  secondaryDiagnosis?: string;
  symptoms: string[];
  duration: string;
  severity: 'mild' | 'moderate' | 'severe';
  notes?: string;
}

interface PatientDiagnosisProps {
  data: Diagnosis;
  onUpdate: (data: Partial<Diagnosis>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const PatientDiagnosis: React.FC<PatientDiagnosisProps> = ({ data, onUpdate, onNext, onPrev }) => {
  const [newSymptom, setNewSymptom] = useState('');
  const [error, setError] = useState('');

  const commonSymptoms = [
    'Fever', 'Headache', 'Cough', 'Sore throat', 'Fatigue', 'Nausea', 'Vomiting',
    'Abdominal pain', 'Back pain', 'Chest pain', 'Shortness of breath', 'Dizziness',
    'Loss of appetite', 'Weight loss', 'Muscle aches', 'Joint pain', 'Rash', 'Swelling'
  ];

  const commonDiagnoses = [
    'Upper Respiratory Tract Infection', 'Hypertension', 'Diabetes Mellitus Type 2',
    'Gastroenteritis', 'Migraine', 'Anxiety Disorder', 'Depression', 'Allergic Rhinitis',
    'Bronchitis', 'Pneumonia', 'Urinary Tract Infection', 'Skin Infection', 'Arthritis',
    'Gastric Ulcer', 'Sinusitis', 'Asthma', 'Chronic Obstructive Pulmonary Disease'
  ];

  const handleInputChange = (field: keyof Diagnosis, value: any) => {
    onUpdate({ [field]: value });
  };

  const addSymptom = (symptom: string) => {
    if (symptom.trim() && !data.symptoms.includes(symptom.trim())) {
      onUpdate({ symptoms: [...data.symptoms, symptom.trim()] });
      setNewSymptom('');
    }
  };

  const removeSymptom = (index: number) => {
    const updatedSymptoms = data.symptoms.filter((_, i) => i !== index);
    onUpdate({ symptoms: updatedSymptoms });
  };

  const handleNext = () => {
    if (!data.primaryDiagnosis.trim()) {
      setError('Primary diagnosis is required');
      return;
    }
    
    if (data.symptoms.length === 0) {
      setError('At least one symptom is required');
      return;
    }
    
    if (!data.duration.trim()) {
      setError('Duration of symptoms is required');
      return;
    }
    
    setError('');
    onNext();
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Patient Diagnosis
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Enter the patient's diagnosis, symptoms, and related information
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      <div className="space-y-6">
        {/* Primary Diagnosis */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Primary Diagnosis *
          </label>
          <input
            type="text"
            value={data.primaryDiagnosis}
            onChange={(e) => handleInputChange('primaryDiagnosis', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="Enter primary diagnosis"
            list="common-diagnoses"
          />
          <datalist id="common-diagnoses">
            {commonDiagnoses.map((diagnosis) => (
              <option key={diagnosis} value={diagnosis} />
            ))}
          </datalist>
        </div>

        {/* Secondary Diagnosis */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Secondary Diagnosis (Optional)
          </label>
          <input
            type="text"
            value={data.secondaryDiagnosis || ''}
            onChange={(e) => handleInputChange('secondaryDiagnosis', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="Enter secondary diagnosis (if any)"
            list="common-diagnoses"
          />
        </div>

        {/* Symptoms */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Symptoms *
          </label>
          
          {/* Add Symptom Input */}
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={newSymptom}
              onChange={(e) => setNewSymptom(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addSymptom(newSymptom)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Type a symptom and press Enter"
              list="common-symptoms"
            />
            <button
              type="button"
              onClick={() => addSymptom(newSymptom)}
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
            >
              Add
            </button>
          </div>

          <datalist id="common-symptoms">
            {commonSymptoms.map((symptom) => (
              <option key={symptom} value={symptom} />
            ))}
          </datalist>

          {/* Common Symptoms Quick Add */}
          <div className="mb-3">
            <p className="text-xs text-gray-500 mb-2">Quick add common symptoms:</p>
            <div className="flex flex-wrap gap-2">
              {commonSymptoms.slice(0, 10).map((symptom) => (
                <button
                  key={symptom}
                  type="button"
                  onClick={() => addSymptom(symptom)}
                  disabled={data.symptoms.includes(symptom)}
                  className={`px-2 py-1 text-xs rounded-full transition-colors ${
                    data.symptoms.includes(symptom)
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed dark:bg-gray-600'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  {symptom}
                </button>
              ))}
            </div>
          </div>

          {/* Selected Symptoms */}
          <div className="flex flex-wrap gap-2">
            {data.symptoms.map((symptom, index) => (
              <div
                key={index}
                className="flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
              >
                <span>{symptom}</span>
                <button
                  type="button"
                  onClick={() => removeSymptom(index)}
                  className="ml-1 text-primary/60 hover:text-primary/80"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Duration and Severity */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Duration of Symptoms *
            </label>
            <input
              type="text"
              value={data.duration}
              onChange={(e) => handleInputChange('duration', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="e.g., 3 days, 2 weeks, 1 month"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Severity
            </label>
            <select
              value={data.severity}
              onChange={(e) => handleInputChange('severity', e.target.value as 'mild' | 'moderate' | 'severe')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="mild">Mild</option>
              <option value="moderate">Moderate</option>
              <option value="severe">Severe</option>
            </select>
          </div>
        </div>

        {/* Clinical Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Clinical Notes (Optional)
          </label>
          <textarea
            value={data.notes || ''}
            onChange={(e) => handleInputChange('notes', e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="Additional clinical observations, examination findings, or relevant notes..."
          />
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-600">
        <button
          onClick={onPrev}
          className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-medium dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500"
        >
          Previous: Patient
        </button>
        <button
          onClick={handleNext}
          className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium"
        >
          Next: Lifestyle Advice
        </button>
      </div>
    </div>
  );
};

export default PatientDiagnosis;