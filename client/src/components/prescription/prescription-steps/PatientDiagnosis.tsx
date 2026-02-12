import React, { useState, useEffect, useRef } from 'react';
import { apiService } from '../../../services/api';

interface DiagnosisEntry {
  primaryDiagnosis: string;
  secondaryDiagnosis?: string;
  symptoms: string[];
  duration: string;
  severity: 'mild' | 'moderate' | 'severe';
  notes?: string;
}

interface PatientDiagnosisProps {
  data: DiagnosisEntry[];
  onUpdate: (data: DiagnosisEntry[]) => void;
  onNext: () => void;
  onPrev: () => void;
}

interface SavedDiagnosis {
  diagnosis: string;
  count: number;
  lastUsed: string;
}

interface SavedSymptom {
  symptom: string;
  count: number;
  lastUsed: string;
}

const PatientDiagnosis: React.FC<PatientDiagnosisProps> = ({ data, onUpdate, onNext, onPrev }) => {
  const [icdCode, setIcdCode] = useState('');
  const [diagnosisText, setDiagnosisText] = useState('');
  const [severity, setSeverity] = useState<'mild' | 'moderate' | 'severe'>('mild');
  const [duration, setDuration] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  const [savedDiagnoses, setSavedDiagnoses] = useState<SavedDiagnosis[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [filteredDiagnoses, setFilteredDiagnoses] = useState<SavedDiagnosis[]>([]);
  const [isLoadingDiagnoses, setIsLoadingDiagnoses] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [savedSymptoms, setSavedSymptoms] = useState<SavedSymptom[]>([]);
  const [showSymptomsDropdown, setShowSymptomsDropdown] = useState(false);
  const [filteredSymptoms, setFilteredSymptoms] = useState<SavedSymptom[]>([]);
  const [isLoadingSymptoms, setIsLoadingSymptoms] = useState(false);
  const symptomsDropdownRef = useRef<HTMLDivElement>(null);
  const symptomsInputRef = useRef<HTMLInputElement>(null);
  const [isPersistingSymptoms, setIsPersistingSymptoms] = useState(false);
  const [symptomSavedIndicator, setSymptomSavedIndicator] = useState(false);

  const fetchSavedDiagnoses = async () => {
    setIsLoadingDiagnoses(true);
    try {
      const response = await apiService.prescriptions.getSavedDiagnoses();
      setSavedDiagnoses(response.data.diagnoses || []);
    } catch (error) {
      console.error('Error fetching saved diagnoses:', error);
    } finally {
      setIsLoadingDiagnoses(false);
    }
  };

  const fetchSavedSymptoms = async () => {
    setIsLoadingSymptoms(true);
    try {
      const response = await apiService.prescriptions.getSavedSymptoms();
      setSavedSymptoms(response.data.symptoms || []);
    } catch (error) {
      console.error('Error fetching saved symptoms:', error);
    } finally {
      setIsLoadingSymptoms(false);
    }
  };

  const persistCustomSymptoms = async () => {
    try {
      const entered = symptoms
        .split(',')
        .map(s => s.trim())
        .filter(Boolean);
      if (entered.length === 0) return;

      const existingLower = savedSymptoms.map(s => s.symptom.toLowerCase());

      setIsPersistingSymptoms(true);
      let anySaved = false;

      for (const sym of entered) {
        if (!existingLower.includes(sym.toLowerCase())) {
          try {
            await apiService.prescriptions.addSavedSymptom({ symptom: sym });
            anySaved = true;
          } catch (err) {
            console.error('Failed to save symptom', sym, err);
          }
        }
      }

      // Refresh saved symptoms
      await fetchSavedSymptoms();

      if (anySaved) {
        setSymptomSavedIndicator(true);
        window.setTimeout(() => setSymptomSavedIndicator(false), 2000);
      }
      setIsPersistingSymptoms(false);
    } catch (err) {
      console.error('Error persisting custom symptoms:', err);
    }
  };

  useEffect(() => {
    // Fetch saved diagnoses and symptoms when component mounts
    fetchSavedDiagnoses();
    fetchSavedSymptoms();
  }, []);

  useEffect(() => {
    // Filter diagnoses based on input
    if (diagnosisText.trim()) {
      const filtered = savedDiagnoses.filter(d =>
        d.diagnosis.toLowerCase().includes(diagnosisText.toLowerCase())
      );
      setFilteredDiagnoses(filtered);
    } else {
      setFilteredDiagnoses(savedDiagnoses);
    }
  }, [diagnosisText, savedDiagnoses]);

  useEffect(() => {
    // Filter symptoms based on input
    if (symptoms.trim()) {
      const filtered = savedSymptoms.filter(s =>
        s.symptom.toLowerCase().includes(symptoms.toLowerCase())
      );
      setFilteredSymptoms(filtered);
    } else {
      setFilteredSymptoms(savedSymptoms);
    }
  }, [symptoms, savedSymptoms]);

  useEffect(() => {
    // Handle click outside to close dropdowns
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
      if (
        symptomsDropdownRef.current &&
        !symptomsDropdownRef.current.contains(event.target as Node) &&
        symptomsInputRef.current &&
        !symptomsInputRef.current.contains(event.target as Node)
      ) {
        setShowSymptomsDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleDiagnosisSelect = (diagnosis: string) => {
    setDiagnosisText(diagnosis);
    setShowDropdown(false);
  };

  const handleSymptomSelect = (symptom: string) => {
    // Add symptom to the symptoms list (comma-separated)
    const existingSymptoms = symptoms
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    if (!existingSymptoms.includes(symptom)) {
      const newSymptoms = [...existingSymptoms, symptom].join(', ');
      setSymptoms(newSymptoms);
    }
    setShowSymptomsDropdown(false);
  };

  const handleAddDiagnosis = () => {
    const primaryDiagnosis = icdCode || diagnosisText.trim();

    if (!primaryDiagnosis) {
      setError('Please select an ICD-10 code or enter a diagnosis.');
      return;
    }

    const newDiagnosis: DiagnosisEntry = {
      primaryDiagnosis: icdCode ? icdCode : diagnosisText.trim(),
      secondaryDiagnosis: icdCode ? diagnosisText.trim() || undefined : undefined,
      symptoms: symptoms.trim() ? symptoms.split(',').map(s => s.trim()).filter(Boolean) : [],
      duration: duration.trim() || '',
      severity,
      notes: notes.trim() || undefined,
    };

    onUpdate([...data, newDiagnosis]);

    // Reset form
    setIcdCode('');
    setDiagnosisText('');
    setSeverity('mild');
    setDuration('');
    setSymptoms('');
    setNotes('');
    setError('');
  };

  const handleRemoveDiagnosis = (index: number) => {
    onUpdate(data.filter((_, i) => i !== index));
  };

  const handleNext = () => {
    if (data.length === 0) {
      setError('Please add at least one diagnosis before proceeding.');
      return;
    }
    setError('');
    onNext();
  };

  const getSeverityLabel = (sev: string) => sev.charAt(0).toUpperCase() + sev.slice(1);

  return (
    <div className="min-h-screen flex justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-3xl space-y-8">
        {/* Diagnosis Form Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-8 sm:px-10">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-2">
              Patient Diagnosis
            </h1>
            <p className="text-center text-gray-500 dark:text-gray-400 mb-8">
              Enter the patient's diagnosis details below.
            </p>

            {error && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
              </div>
            )}

            <div className="space-y-6">
              {/* ICD Code + Free Text Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2" htmlFor="icd-code">
                    Saved Diagnoses
                  </label>
                  <select
                    id="icd-code"
                    value={icdCode}
                    onChange={(e) => setIcdCode(e.target.value)}
                    className="w-full rounded-md border border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary focus:ring-primary dark:bg-gray-700 dark:text-white px-3 py-2"
                  >
                    <option value="">Select a saved diagnosis or enter below</option>
                    {savedDiagnoses && savedDiagnoses.length > 0 ? (
                      savedDiagnoses.map((item) => (
                        <option key={item.diagnosis} value={item.diagnosis}>
                          {item.diagnosis}
                        </option>
                      ))
                    ) : (
                      <option disabled>No saved diagnoses</option>
                    )}
                  </select>
                </div>
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center justify-between" htmlFor="diagnosis">
                    <span>Diagnosis (Free Text)</span>
                    <button
                      type="button"
                      onClick={fetchSavedDiagnoses}
                      disabled={isLoadingDiagnoses}
                      className="text-xs text-primary hover:text-primary/80 disabled:text-gray-400 transition-colors"
                      title="Refresh saved diagnoses"
                    >
                      {isLoadingDiagnoses ? '⟳ Loading...' : '⟳ Refresh'}
                    </button>
                  </label>
                  <input
                    ref={inputRef}
                    id="diagnosis"
                    type="text"
                    value={diagnosisText}
                    onChange={(e) => {
                      setDiagnosisText(e.target.value);
                      setShowDropdown(true);
                    }}
                    onFocus={() => setShowDropdown(true)}
                    onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
                    placeholder="Start typing or select from saved diagnoses"
                    className="w-full rounded-md border border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary focus:ring-primary dark:bg-gray-700 dark:text-white px-3 py-2"
                    autoComplete="off"
                  />
                  {showDropdown && filteredDiagnoses.length > 0 && (
                    <div
                      ref={dropdownRef}
                      className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg max-h-60 overflow-auto"
                    >
                      {filteredDiagnoses.map((item, index) => (
                        <div
                          key={index}
                          onClick={() => handleDiagnosisSelect(item.diagnosis)}
                          className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer flex justify-between items-center"
                        >
                          <span className="text-gray-900 dark:text-white">{item.diagnosis}</span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            Used {item.count}x
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                  {showDropdown && diagnosisText.trim() && filteredDiagnoses.length === 0 && (
                    <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg p-3">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        No saved diagnoses match. You can add "<strong>{diagnosisText.trim()}</strong>" as a new diagnosis.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Duration + Symptoms Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2" htmlFor="duration">
                    Duration <span className="text-gray-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    id="duration"
                    type="text"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="e.g., 3 days, 2 weeks, 1 month"
                    className="w-full rounded-md border border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary focus:ring-primary dark:bg-gray-700 dark:text-white px-3 py-2"
                  />
                </div>
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center justify-between" htmlFor="symptoms">
                    <span>Symptoms</span>
                    <div className="flex items-center gap-3">
                      {isPersistingSymptoms ? (
                        <span className="text-xs text-gray-500">Saving...</span>
                      ) : symptomSavedIndicator ? (
                        <span className="text-xs text-green-600 flex items-center gap-1">✓ Saved</span>
                      ) : null}
                      <button
                        type="button"
                        onClick={fetchSavedSymptoms}
                        disabled={isLoadingSymptoms}
                        className="text-xs text-primary hover:text-primary/80 disabled:text-gray-400 transition-colors"
                        title="Refresh saved symptoms"
                      >
                        {isLoadingSymptoms ? '⟳ Loading...' : '⟳ Refresh'}
                      </button>
                    </div>
                  </label>
                  <input
                    ref={symptomsInputRef}
                    id="symptoms"
                    type="text"
                    value={symptoms}
                    onChange={(e) => {
                      setSymptoms(e.target.value);
                      setShowSymptomsDropdown(true);
                    }}
                    onFocus={() => setShowSymptomsDropdown(true)}
                    onBlur={() => setTimeout(() => { setShowSymptomsDropdown(false); persistCustomSymptoms(); }, 150)}
                    placeholder="Start typing or select from saved symptoms (comma separated)"
                    className="w-full rounded-md border border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary focus:ring-primary dark:bg-gray-700 dark:text-white px-3 py-2"
                    autoComplete="off"
                  />
                  {showSymptomsDropdown && filteredSymptoms.length > 0 && (
                    <div
                      ref={symptomsDropdownRef}
                      className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg max-h-60 overflow-auto"
                    >
                      {filteredSymptoms.map((item, index) => (
                        <div
                          key={index}
                          onClick={() => handleSymptomSelect(item.symptom)}
                          className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer flex justify-between items-center"
                        >
                          <span className="text-gray-900 dark:text-white">{item.symptom}</span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            Used {item.count}x
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                  {showSymptomsDropdown && symptoms.trim() && filteredSymptoms.length === 0 && (
                    <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg p-3">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        No saved symptoms match. You can add "<strong>{symptoms.trim()}</strong>" as a new symptom.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Severity Radio Buttons */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Severity / Stage
                </label>
                <div className="flex items-center gap-4 flex-wrap">
                  {(['mild', 'moderate', 'severe'] as const).map((level) => (
                    <label key={level} className="inline-flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="severity"
                        checked={severity === level}
                        onChange={() => setSeverity(level)}
                        className="form-radio h-4 w-4 text-primary border-gray-300 dark:border-gray-600 focus:ring-primary"
                      />
                      <span className="ml-2 text-gray-900 dark:text-gray-200">
                        {getSeverityLabel(level)}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2" htmlFor="notes">
                  Notes
                </label>
                <textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add any additional comments here..."
                  rows={3}
                  className="w-full rounded-md border border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary focus:ring-primary dark:bg-gray-700 dark:text-white px-3 py-2"
                />
              </div>

              {/* Add Diagnosis Button */}
              <div className="flex justify-end pt-4">
                <button
                  type="button"
                  onClick={handleAddDiagnosis}
                  className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                  </svg>
                  Add Diagnosis
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Added Diagnoses List */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Added Diagnoses {data.length > 0 && `(${data.length})`}
            </h2>
          </div>
          <div className="p-6 sm:p-8">
            {data.length === 0 ? (
              <p className="text-center text-gray-400 dark:text-gray-500 py-4">
                No diagnoses added yet. Use the form above to add one.
              </p>
            ) : (
              <ul className="space-y-4">
                {data.map((diagnosis, index) => (
                  <li
                    key={index}
                    className="p-4 rounded-md border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-700/30"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {diagnosis.primaryDiagnosis}
                        </p>
                        {diagnosis.secondaryDiagnosis && (
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {diagnosis.secondaryDiagnosis}
                          </p>
                        )}
                        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Severity: <span className="font-medium text-gray-900 dark:text-white">{getSeverityLabel(diagnosis.severity)}</span>
                          </p>
                          {diagnosis.duration && (
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Duration: <span className="font-medium text-gray-900 dark:text-white">{diagnosis.duration}</span>
                            </p>
                          )}
                        </div>
                        {diagnosis.symptoms && diagnosis.symptoms.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {diagnosis.symptoms.map((symptom, i) => (
                              <span key={i} className="inline-block px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded-full">
                                {symptom}
                              </span>
                            ))}
                          </div>
                        )}
                        {diagnosis.notes && (
                          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                            {diagnosis.notes}
                          </p>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveDiagnosis(index)}
                        className="text-gray-400 hover:text-red-500 transition-colors ml-4"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between pt-2 pb-8">
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
    </div>
  );
};

export default PatientDiagnosis;
