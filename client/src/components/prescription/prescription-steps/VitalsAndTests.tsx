import React, { useState, useEffect } from 'react';

interface Vitals {
  bloodPressure?: string;
  temperature?: string;
  heartRate?: string;
  weight?: string;
  height?: string;
  bmi?: string;
  oxygenSaturation?: string;
  respiratoryRate?: string;
  pulse?: string;
}

interface TestResult {
  testName: string;
  result: string;
  units: string;
  notes: string;
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

const recommendedTests = [
  'Spirometry',
  'Chest X-ray',
  'HRCT',
  'ABG',
  'CBC',
  'CRP',
  'D-dimer',
  'IgE',
  'FeNO',
  'ECG/EKG',
  'Lipid Panel',
  'Blood Glucose',
];

const VitalsAndTests: React.FC<VitalsAndTestsProps> = ({
  vitalsData,
  testsData,
  onUpdateVitals,
  onUpdateTests,
  onNext,
  onPrev
}) => {
  const [testResultForm, setTestResultForm] = useState<TestResult>({
    testName: '',
    result: '',
    units: '',
    notes: '',
  });

  // Reconstruct addedResults from saved labResults so data persists across step navigation
  const parseLabResult = (resultStr: string): TestResult => {
    // Format: "TestName: Result Units - Notes"
    const colonIdx = resultStr.indexOf(':');
    if (colonIdx === -1) return { testName: resultStr, result: '', units: '', notes: '' };
    const testName = resultStr.substring(0, colonIdx).trim();
    let rest = resultStr.substring(colonIdx + 1).trim();
    let notes = '';
    const dashIdx = rest.indexOf(' - ');
    if (dashIdx !== -1) {
      notes = rest.substring(dashIdx + 3).trim();
      rest = rest.substring(0, dashIdx).trim();
    }
    const parts = rest.split(' ');
    const result = parts[0] || '';
    const units = parts.slice(1).join(' ');
    return { testName, result, units, notes };
  };

  const [addedResults, setAddedResults] = useState<TestResult[]>(() => {
    return (testsData.labResults || []).map(parseLabResult);
  });

  // Calculate BMI when height or weight changes
  useEffect(() => {
    const weight = parseFloat(vitalsData.weight || '0');
    const height = parseFloat(vitalsData.height || '0');

    if (weight > 0 && height > 0) {
      const heightInMeters = height / 100;
      const bmi = (weight / (heightInMeters * heightInMeters)).toFixed(1);
      onUpdateVitals({ bmi });
    }
  }, [vitalsData.weight, vitalsData.height]);

  const handleVitalChange = (field: keyof Vitals, value: string) => {
    onUpdateVitals({ [field]: value });
  };

  const toggleTest = (test: string) => {
    const current = testsData.orderedTests;
    if (current.includes(test)) {
      onUpdateTests({ orderedTests: current.filter((t) => t !== test) });
    } else {
      onUpdateTests({ orderedTests: [...current, test] });
    }
  };

  const handleAddTestResult = () => {
    if (!testResultForm.testName.trim() || !testResultForm.result.trim()) return;

    const resultString = `${testResultForm.testName}: ${testResultForm.result}${testResultForm.units ? ' ' + testResultForm.units : ''}${testResultForm.notes ? ' - ' + testResultForm.notes : ''}`;

    const newResults = [...addedResults, { ...testResultForm }];
    setAddedResults(newResults);

    onUpdateTests({
      labResults: [...(testsData.labResults || []), resultString],
      testNotes: testResultForm.notes || testsData.testNotes,
    });

    setTestResultForm({ testName: '', result: '', units: '', notes: '' });
  };

  const removeTestResult = (index: number) => {
    const newResults = addedResults.filter((_, i) => i !== index);
    setAddedResults(newResults);
    const newLabResults = (testsData.labResults || []).filter((_, i) => i !== index);
    onUpdateTests({ labResults: newLabResults });
  };

  return (
    <div className="min-h-screen flex justify-center bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-4xl">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white leading-tight">
            Patient Vitals and Tests
          </h1>
        </div>

        <div className="grid grid-cols-1 gap-12">
          {/* Current Vitals Section */}
          <section>
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 leading-tight tracking-tight mb-6">
              Current Vitals
            </h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <label className="flex flex-col">
                <p className="text-slate-700 dark:text-gray-300 text-sm font-medium leading-normal pb-2">SpO2 (%)</p>
                <input
                  type="text"
                  value={vitalsData.oxygenSaturation || ''}
                  onChange={(e) => handleVitalChange('oxygenSaturation', e.target.value)}
                  className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white h-11 px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="e.g. 98"
                />
              </label>

              <label className="flex flex-col">
                <p className="text-slate-700 dark:text-gray-300 text-sm font-medium leading-normal pb-2">Respiratory Rate (breaths/min)</p>
                <input
                  type="text"
                  value={vitalsData.respiratoryRate || ''}
                  onChange={(e) => handleVitalChange('respiratoryRate', e.target.value)}
                  className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white h-11 px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="e.g. 18"
                />
              </label>

              <label className="flex flex-col">
                <p className="text-slate-700 dark:text-gray-300 text-sm font-medium leading-normal pb-2">Pulse (bpm)</p>
                <input
                  type="text"
                  value={vitalsData.heartRate || ''}
                  onChange={(e) => handleVitalChange('heartRate', e.target.value)}
                  className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white h-11 px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="e.g. 72"
                />
              </label>

              <label className="flex flex-col">
                <p className="text-slate-700 dark:text-gray-300 text-sm font-medium leading-normal pb-2">BP (mmHg)</p>
                <input
                  type="text"
                  value={vitalsData.bloodPressure || ''}
                  onChange={(e) => handleVitalChange('bloodPressure', e.target.value)}
                  className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white h-11 px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="e.g. 120/80"
                />
              </label>

              <label className="flex flex-col">
                <p className="text-slate-700 dark:text-gray-300 text-sm font-medium leading-normal pb-2">Temperature (°C)</p>
                <input
                  type="text"
                  value={vitalsData.temperature || ''}
                  onChange={(e) => handleVitalChange('temperature', e.target.value)}
                  className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white h-11 px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="e.g. 37.0"
                />
              </label>

              <label className="flex flex-col">
                <p className="text-slate-700 dark:text-gray-300 text-sm font-medium leading-normal pb-2">Weight (kg)</p>
                <input
                  type="text"
                  value={vitalsData.weight || ''}
                  onChange={(e) => handleVitalChange('weight', e.target.value)}
                  className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white h-11 px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="e.g. 70"
                />
              </label>

              <label className="flex flex-col">
                <p className="text-slate-700 dark:text-gray-300 text-sm font-medium leading-normal pb-2">Height (cm)</p>
                <input
                  type="text"
                  value={vitalsData.height || ''}
                  onChange={(e) => handleVitalChange('height', e.target.value)}
                  className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white h-11 px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="e.g. 175"
                />
              </label>

              <label className="flex flex-col">
                <p className="text-slate-700 dark:text-gray-300 text-sm font-medium leading-normal pb-2">BMI (kg/m²)</p>
                <input
                  type="text"
                  value={vitalsData.bmi || ''}
                  readOnly
                  className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-600 text-gray-900 dark:text-white h-11 px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none cursor-not-allowed"
                  placeholder="Auto-calculated"
                />
              </label>
            </div>
          </section>

          {/* Recommended Tests Section */}
          <section>
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 leading-tight tracking-tight mb-6">
              Recommended Tests
            </h2>
            <div className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3 lg:grid-cols-4">
              {recommendedTests.map((test) => (
                <label key={test} className="flex items-center gap-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={testsData.orderedTests.includes(test)}
                    onChange={() => toggleTest(test)}
                    className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-primary focus:ring-primary"
                  />
                  <p className="text-gray-800 dark:text-gray-200 text-sm font-normal leading-normal">{test}</p>
                </label>
              ))}
            </div>
          </section>

          {/* Test Results Section */}
          <section>
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 leading-tight tracking-tight mb-6">
              Test Results
            </h2>
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <label className="flex flex-col">
                  <p className="text-slate-700 dark:text-gray-300 text-sm font-medium leading-normal pb-2">Test Name</p>
                  <input
                    type="text"
                    value={testResultForm.testName}
                    onChange={(e) => setTestResultForm({ ...testResultForm, testName: e.target.value })}
                    className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white h-11 px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Enter Test Name"
                  />
                </label>
                <label className="flex flex-col">
                  <p className="text-slate-700 dark:text-gray-300 text-sm font-medium leading-normal pb-2">Result</p>
                  <input
                    type="text"
                    value={testResultForm.result}
                    onChange={(e) => setTestResultForm({ ...testResultForm, result: e.target.value })}
                    className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white h-11 px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Enter Result"
                  />
                </label>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <label className="flex flex-col">
                  <p className="text-slate-700 dark:text-gray-300 text-sm font-medium leading-normal pb-2">Units</p>
                  <input
                    type="text"
                    value={testResultForm.units}
                    onChange={(e) => setTestResultForm({ ...testResultForm, units: e.target.value })}
                    className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white h-11 px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="e.g. mg/dL"
                  />
                </label>
              </div>

              <label className="flex flex-col">
                <p className="text-slate-700 dark:text-gray-300 text-sm font-medium leading-normal pb-2">Notes</p>
                <textarea
                  value={testResultForm.notes}
                  onChange={(e) => setTestResultForm({ ...testResultForm, notes: e.target.value })}
                  className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white min-h-[96px] p-3 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  placeholder="Add any relevant notes..."
                />
              </label>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleAddTestResult}
                  className="flex min-w-[84px] cursor-pointer items-center justify-center rounded-md h-10 px-4 bg-primary text-white text-sm font-bold leading-normal tracking-wide hover:bg-primary/90 transition-colors"
                >
                  Add Test Result
                </button>
              </div>
            </div>
          </section>

          {/* Past Test Results Section */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 leading-tight tracking-tight">
                Past Test Results
              </h2>
            </div>

            {addedResults.length === 0 && (testsData.labResults || []).length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-6 rounded-lg border border-dashed border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 p-8 text-center">
                <div className="flex flex-col items-center gap-2">
                  <svg className="w-16 h-16 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-gray-900 dark:text-white text-lg font-bold leading-tight tracking-tight">
                    No past test results available
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm font-normal leading-normal max-w-md">
                    Once you add test results, you can view historical data and trends here to monitor patient progress.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {addedResults.map((result, index) => (
                  <div
                    key={index}
                    className="flex items-start justify-between p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
                  >
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">{result.testName}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Result: <span className="font-medium text-gray-900 dark:text-white">{result.result}</span>
                        {result.units && <span className="ml-1 text-gray-500">{result.units}</span>}
                      </p>
                      {result.notes && (
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{result.notes}</p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => removeTestResult(index)}
                      className="text-gray-400 hover:text-red-500 transition-colors ml-4"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-12 pt-6 border-t border-gray-200 dark:border-gray-600 pb-8">
          <button
            onClick={onPrev}
            className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-medium dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500"
          >
            Previous: Lifestyle
          </button>
          <button
            onClick={onNext}
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium"
          >
            Next: Prescription
          </button>
        </div>
      </div>
    </div>
  );
};

export default VitalsAndTests;
