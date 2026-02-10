import React, { useState, useEffect, useRef } from 'react';
import { apiService } from '../../../services/api';

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

interface SavedTest {
  test: string;
  count: number;
  lastUsed: string;
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

interface SavedTests {
  [key: string]: SavedTest;
}

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

  const [savedTests, setSavedTests] = useState<SavedTest[]>([]);
  const [allAvailableTests, setAllAvailableTests] = useState<string[]>(recommendedTests);
  const [showTestsDropdown, setShowTestsDropdown] = useState(false);
  const [testSearchInput, setTestSearchInput] = useState('');
  const [filteredTestsForDropdown, setFilteredTestsForDropdown] = useState<string[]>([]);
  const [isLoadingTests, setIsLoadingTests] = useState(false);
  const testsDropdownRef = useRef<HTMLDivElement>(null);
  const testsInputRef = useRef<HTMLInputElement>(null);

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

  // Fetch saved tests when component mounts
  useEffect(() => {
    const fetchSavedTests = async () => {
      setIsLoadingTests(true);
      try {
        const response = await apiService.prescriptions.getSavedTests();
        const tests = response.data.tests || [];
        setSavedTests(tests);
        
        // Merge saved tests with recommended tests
        const testNames = tests.map((t: SavedTest) => t.test);
        const merged = Array.from(new Set([...recommendedTests, ...testNames]));
        setAllAvailableTests(merged);
      } catch (error) {
        console.error('Error fetching saved tests:', error);
      } finally {
        setIsLoadingTests(false);
      }
    };

    fetchSavedTests();
  }, []);

  // Filter tests based on search input
  useEffect(() => {
    if (testSearchInput.trim()) {
      const filtered = allAvailableTests.filter(t =>
        t.toLowerCase().includes(testSearchInput.toLowerCase()) &&
        !testsData.orderedTests.includes(t)
      );
      setFilteredTestsForDropdown(filtered);
    } else {
      setFilteredTestsForDropdown(
        allAvailableTests.filter(t => !testsData.orderedTests.includes(t))
      );
    }
  }, [testSearchInput, allAvailableTests, testsData.orderedTests]);

  // Handle click outside dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        testsDropdownRef.current &&
        !testsDropdownRef.current.contains(event.target as Node) &&
        testsInputRef.current &&
        !testsInputRef.current.contains(event.target as Node)
      ) {
        setShowTestsDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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

  const handleTestSelect = (test: string) => {
    toggleTest(test);
    setTestSearchInput('');
    setShowTestsDropdown(false);
  };

  const handleAddCustomTest = () => {
    if (testSearchInput.trim() && !testsData.orderedTests.includes(testSearchInput.trim())) {
      const customTest = testSearchInput.trim();
      toggleTest(customTest);
      
      // Add to available tests if not already there
      if (!allAvailableTests.includes(customTest)) {
        setAllAvailableTests([...allAvailableTests, customTest]);
      }
      
      setTestSearchInput('');
      setShowTestsDropdown(false);
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
            
            <div className="mb-6 relative">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center justify-between">
                <span>Select Tests</span>
                <button
                  type="button"
                  onClick={() => {
                    setIsLoadingTests(true);
                    apiService.prescriptions.getSavedTests().then(response => {
                      const tests = response.data.tests || [];
                      setSavedTests(tests);
                      const testNames = tests.map((t: SavedTest) => t.test);
                      const merged = Array.from(new Set([...recommendedTests, ...testNames]));
                      setAllAvailableTests(merged);
                      setIsLoadingTests(false);
                    });
                  }}
                  disabled={isLoadingTests}
                  className="text-xs text-primary hover:text-primary/80 disabled:text-gray-400 transition-colors"
                  title="Refresh saved tests"
                >
                  {isLoadingTests ? '⟳ Loading...' : '⟳ Refresh'}
                </button>
              </label>
              
              <input
                ref={testsInputRef}
                type="text"
                value={testSearchInput}
                onChange={(e) => {
                  setTestSearchInput(e.target.value);
                  setShowTestsDropdown(true);
                }}
                onFocus={() => setShowTestsDropdown(true)}
                placeholder="Search tests or add custom test..."
                className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
                autoComplete="off"
              />
              
              {showTestsDropdown && (
                <div
                  ref={testsDropdownRef}
                  className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg max-h-60 overflow-auto"
                >
                  {filteredTestsForDropdown.length > 0 ? (
                    <>
                      {filteredTestsForDropdown.map((test, index) => {
                        const savedTest = savedTests.find(t => t.test === test);
                        return (
                          <div
                            key={index}
                            onClick={() => handleTestSelect(test)}
                            className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer flex justify-between items-center"
                          >
                            <span className="text-gray-900 dark:text-white">{test}</span>
                            {savedTest && (
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                Used {savedTest.count}x
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </>
                  ) : null}
                  
                  {testSearchInput.trim() && !allAvailableTests.includes(testSearchInput.trim()) && (
                    <div
                      onClick={handleAddCustomTest}
                      className="px-3 py-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 cursor-pointer border-t border-gray-200 dark:border-gray-600"
                    >
                      <p className="text-sm text-blue-600 dark:text-blue-400">
                        + Add "<strong>{testSearchInput.trim()}</strong>" as new test
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Selected Tests Display */}
            {testsData.orderedTests.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Selected Tests ({testsData.orderedTests.length})</h3>
                <div className="flex flex-wrap gap-2">
                  {testsData.orderedTests.map((test) => {
                    const savedTest = savedTests.find(t => t.test === test);
                    return (
                      <div
                        key={test}
                        className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 dark:bg-primary/20 text-primary dark:text-blue-300 rounded-full text-sm"
                      >
                        <span>{test}</span>
                        {savedTest && (
                          <span className="text-xs opacity-75">({savedTest.count}x)</span>
                        )}
                        <button
                          type="button"
                          onClick={() => toggleTest(test)}
                          className="ml-1 hover:opacity-70 transition-opacity"
                        >
                          ✕
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
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
