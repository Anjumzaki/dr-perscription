import React, { useState, useEffect } from 'react';

interface Vitals {
  bloodPressure?: string;
  temperature?: string;
  heartRate?: string;
  weight?: string;
  height?: string;
  bmi?: string;
  oxygenSaturation?: string;
}

interface Tests {
  orderedTests: string[];
  labResults?: string[];
  imagingResults?: string[];
  testNotes?: string;
}

interface VitalsAndTestsProps {
  vitalsData: Vitals;
  testsData: Tests;
  onUpdateVitals: (data: Partial<Vitals>) => void;
  onUpdateTests: (data: Partial<Tests>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const VitalsAndTests: React.FC<VitalsAndTestsProps> = ({
  vitalsData,
  testsData,
  onUpdateVitals,
  onUpdateTests,
  onNext,
  onPrev
}) => {
  const [newTest, setNewTest] = useState('');
  const [newLabResult, setNewLabResult] = useState('');
  const [newImagingResult, setNewImagingResult] = useState('');

  const commonTests = [
    'Complete Blood Count (CBC)',
    'Basic Metabolic Panel',
    'Lipid Panel',
    'Liver Function Tests',
    'Thyroid Function Tests',
    'Hemoglobin A1C',
    'Urinalysis',
    'ECG/EKG',
    'Chest X-Ray',
    'Blood Glucose',
    'ESR (Erythrocyte Sedimentation Rate)',
    'CRP (C-Reactive Protein)',
    'Kidney Function Tests',
    'Vitamin D',
    'Iron Studies',
    'Coagulation Studies'
  ];

  // Calculate BMI when height or weight changes
  useEffect(() => {
    const weight = parseFloat(vitalsData.weight || '0');
    const height = parseFloat(vitalsData.height || '0');
    
    if (weight > 0 && height > 0) {
      const heightInMeters = height / 100; // Convert cm to meters
      const bmi = (weight / (heightInMeters * heightInMeters)).toFixed(1);
      onUpdateVitals({ bmi });
    }
  }, [vitalsData.weight, vitalsData.height]);

  const handleVitalChange = (field: keyof Vitals, value: string) => {
    onUpdateVitals({ [field]: value });
  };

  const addToArray = (field: keyof Tests, value: string, setter: (value: string) => void) => {
    if (value.trim() && !(testsData[field] as string[]).includes(value.trim())) {
      onUpdateTests({ [field]: [...(testsData[field] as string[]), value.trim()] });
      setter('');
    }
  };

  const removeFromArray = (field: keyof Tests, index: number) => {
    const updatedArray = (testsData[field] as string[]).filter((_, i) => i !== index);
    onUpdateTests({ [field]: updatedArray });
  };

  const addCommonTest = (test: string) => {
    if (!testsData.orderedTests.includes(test)) {
      onUpdateTests({ orderedTests: [...testsData.orderedTests, test] });
    }
  };

  const getBMIStatus = (bmi: number) => {
    if (bmi < 18.5) return { status: 'Underweight', color: 'text-blue-600' };
    if (bmi < 25) return { status: 'Normal', color: 'text-green-600' };
    if (bmi < 30) return { status: 'Overweight', color: 'text-yellow-600' };
    return { status: 'Obese', color: 'text-red-600' };
  };

  const handleNext = () => {
    onNext();
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Patient Vitals & Tests
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Record patient vitals, order tests, and document results
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Vitals Section */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Vital Signs
          </h3>
          
          <div className="space-y-4">
            {/* Blood Pressure */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Blood Pressure (mmHg)
              </label>
              <input
                type="text"
                value={vitalsData.bloodPressure || ''}
                onChange={(e) => handleVitalChange('bloodPressure', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="e.g., 120/80"
              />
            </div>

            {/* Temperature */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Temperature (°F)
              </label>
              <input
                type="text"
                value={vitalsData.temperature || ''}
                onChange={(e) => handleVitalChange('temperature', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="e.g., 98.6"
              />
            </div>

            {/* Heart Rate */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Heart Rate (bpm)
              </label>
              <input
                type="text"
                value={vitalsData.heartRate || ''}
                onChange={(e) => handleVitalChange('heartRate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="e.g., 72"
              />
            </div>

            {/* Weight and Height */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Weight (kg)
                </label>
                <input
                  type="text"
                  value={vitalsData.weight || ''}
                  onChange={(e) => handleVitalChange('weight', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="e.g., 70"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Height (cm)
                </label>
                <input
                  type="text"
                  value={vitalsData.height || ''}
                  onChange={(e) => handleVitalChange('height', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="e.g., 175"
                />
              </div>
            </div>

            {/* BMI Display */}
            {vitalsData.bmi && (
              <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">BMI:</span>
                  <div className="text-right">
                    <span className="text-lg font-bold text-gray-900 dark:text-white">
                      {vitalsData.bmi}
                    </span>
                    <span className={`ml-2 text-sm ${getBMIStatus(parseFloat(vitalsData.bmi)).color}`}>
                      {getBMIStatus(parseFloat(vitalsData.bmi)).status}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Oxygen Saturation */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Oxygen Saturation (%)
              </label>
              <input
                type="text"
                value={vitalsData.oxygenSaturation || ''}
                onChange={(e) => handleVitalChange('oxygenSaturation', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="e.g., 98"
              />
            </div>
          </div>
        </div>

        {/* Tests Section */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Tests & Results
          </h3>

          {/* Ordered Tests */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Ordered Tests
              </label>
              
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={newTest}
                  onChange={(e) => setNewTest(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addToArray('orderedTests', newTest, setNewTest)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="Enter test name"
                />
                <button
                  type="button"
                  onClick={() => addToArray('orderedTests', newTest, setNewTest)}
                  className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
                >
                  Add
                </button>
              </div>

              {/* Quick Add Common Tests */}
              <div className="mb-3">
                <p className="text-xs text-gray-500 mb-2">Quick add common tests:</p>
                <div className="flex flex-wrap gap-2">
                  {commonTests.slice(0, 6).map((test) => (
                    <button
                      key={test}
                      type="button"
                      onClick={() => addCommonTest(test)}
                      disabled={testsData.orderedTests.includes(test)}
                      className={`px-2 py-1 text-xs rounded-full transition-colors ${
                        testsData.orderedTests.includes(test)
                          ? 'bg-gray-200 text-gray-400 cursor-not-allowed dark:bg-gray-600'
                          : 'bg-orange-100 text-orange-700 hover:bg-orange-200 dark:bg-orange-900/20 dark:text-orange-300 dark:hover:bg-orange-900/30'
                      }`}
                    >
                      {test}
                    </button>
                  ))}
                </div>
              </div>

              {/* Selected Tests */}
              <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                {testsData.orderedTests.map((test, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm dark:bg-orange-900/20 dark:text-orange-300"
                  >
                    <span>{test}</span>
                    <button
                      type="button"
                      onClick={() => removeFromArray('orderedTests', index)}
                      className="ml-1 text-orange-500 hover:text-orange-700 dark:hover:text-orange-200"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Lab Results */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Lab Results (if available)
              </label>
              
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={newLabResult}
                  onChange={(e) => setNewLabResult(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addToArray('labResults', newLabResult, setNewLabResult)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="e.g., Glucose: 95 mg/dL (Normal)"
                />
                <button
                  type="button"
                  onClick={() => addToArray('labResults', newLabResult, setNewLabResult)}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                >
                  Add
                </button>
              </div>

              <div className="space-y-1">
                {(testsData.labResults || []).map((result, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 bg-green-50 border border-green-200 rounded-md dark:bg-green-900/10 dark:border-green-800"
                  >
                    <span className="text-sm text-green-800 dark:text-green-200">{result}</span>
                    <button
                      type="button"
                      onClick={() => removeFromArray('labResults', index)}
                      className="text-green-600 hover:text-green-800 dark:hover:text-green-400"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Test Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Additional Test Notes
              </label>
              <textarea
                value={testsData.testNotes || ''}
                onChange={(e) => onUpdateTests({ testNotes: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="Additional notes about tests, results, or observations..."
              />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-600">
        <button
          onClick={onPrev}
          className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-medium dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500"
        >
          Previous: Lifestyle
        </button>
        <button
          onClick={handleNext}
          className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium"
        >
          Next: Prescription
        </button>
      </div>
    </div>
  );
};

export default VitalsAndTests;